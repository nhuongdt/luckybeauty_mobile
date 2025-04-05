import { View, StyleSheet, FlatList, Pressable, Dimensions } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Icon, Input, SearchBar } from '@rneui/themed';
import uuid from 'react-native-uuid';
import { Text } from '@rneui/base';
import ModalAddGioHang from './modal_add_gio_hang';
import realmQuery from '../../store/realm/realmQuery';
import { HoaDonDto, IHoaDonChiTietDto } from '../../services/hoadon/dto';
import { InvoiceStatus } from '../../enum/InvoiceStatus';
import { IParamSearchProductDto, IProductBasic } from '../../services/product/dto';
import ProductService from '../../services/product/ProductService';
import { IPageResultDto } from '../../services/commonDto/IPageResultDto';
import realmDatabase from '../../store/realm/database';
import { LoaiChungTu, TenLoaiChungTu } from '../../enum/LoaiChungTu';
import CommonFunc from '../../utils/CommonFunc';
import { create } from 'react-test-renderer';
import PageEmpty from '../../components/page_empty';
import { IconType } from '../../enum/IconType';
import { ItemProductSale } from '../components/ItemProductSale';
import { SaleManagerTabParamList } from '../../navigation/route_param_list';
import { SaleManagerTab } from '../../navigation/list_name_route';
import { useSaleManagerStackContext } from '../../store/react_context/SaleManagerStackProvide';

type ProductSaleNavigationProps = NativeStackNavigationProp<SaleManagerTabParamList, SaleManagerTab.PRODUCT>;

type ProductSaleRouteProp = RouteProp<SaleManagerTabParamList, SaleManagerTab.PRODUCT>;

const ProductSale = () => {
  const firstLoad = useRef(true);
  const route = useRoute<ProductSaleRouteProp>();
  const navigation = useNavigation<ProductSaleNavigationProps>();
  const { currentInvoice, setCurrentInvoice } = useSaleManagerStackContext();
  const idHoaDonCurrent = currentInvoice?.idHoaDon ?? '';
  const idLoaiChungTu = currentInvoice?.idLoaiChungTu ?? LoaiChungTu.HOA_DON_BAN_LE;

  const [idHoaDonChosing, setIdHoaDonChosing] = useState('');
  const [isShowModalAddGioHang, setIsShowModalAddGioHang] = useState(false);
  const [txtSearchProduct, setTxtSearchProduct] = useState('');
  const [paramSearchProduct, setParamSearchProduct] = useState<IParamSearchProductDto>({
    textSearch: '',
    currentPage: 0,
    pageSize: 10,
    idNhomHangHoas: []
  });
  const [pageResultProduct, setPageResultProduct] = useState<IPageResultDto<IProductBasic>>({
    items: [],
    totalCount: 0,
    totalPage: 0
  });

  const [ctDoing, setCTDoing] = useState<IHoaDonChiTietDto>({} as IHoaDonChiTietDto);

  const PageLoad = async () => { };

  useEffect(() => {
    PageLoad();
  }, []);

  useEffect(() => {
    getInforHoaDon();
  }, [idHoaDonCurrent]);

  const getListProduct = async () => {
    const param = {
      ...paramSearchProduct
    };
    param.textSearch = txtSearchProduct;
    const data = await ProductService.GetListproduct(param);

    if (data?.items?.length > 0) {
      setPageResultProduct({
        ...pageResultProduct,
        items: data?.items,
        totalCount: data?.totalCount
      });
    } else {
      const lst: IProductBasic[] = realmQuery.GetListHangHoa_fromCacche();
      if (lst?.length == 0) {
        realmQuery.Init_DanhMucHangHoa();
      }

      setPageResultProduct({
        ...pageResultProduct,
        items: lst,
        totalCount: lst?.length
      });
    }
  };

  const getInforHoaDon = () => {
    let idHoaDonChosing = null;

    if (!CommonFunc.checkNull_OrEmpty(idHoaDonCurrent)) {
      const itemHD = realmQuery.GetHoaDon_byId(idHoaDonCurrent);
      if (itemHD !== null) {
        idHoaDonChosing = itemHD?.id;
      }
    } else {
      // get hdOpenLast
      const hdOpenLast = realmQuery.GetHoaDonOpenLastest();
      if (hdOpenLast !== null) {
        idHoaDonChosing = hdOpenLast?.id;
      }
    }
    if (idHoaDonChosing) {
      setIdHoaDonChosing(idHoaDonChosing);
      const lstCTHD = realmQuery.GetListChiTietHoaDon_byIdHoaDon(idHoaDonChosing);
      setCurrentInvoice({
        ...currentInvoice,
        idHoaDon: idHoaDonChosing,
        countProduct: lstCTHD?.length ?? 0
      });
    } else {
      setCurrentInvoice({
        ...currentInvoice,
        idHoaDon: '',
        countProduct: 0
      });
    }
  };

  const GetIdHoaDon_andCreateNewHD_ifNotExist = (): string => {
    let idHoaDon = '';
    let existHD = false;
    if (CommonFunc.checkNull_OrEmpty(idHoaDonChosing)) {
      idHoaDon = uuid.v4().toString();
    } else {
      const hd = realmQuery.GetHoaDon_byId(idHoaDonChosing);
      if (hd === null) {
        idHoaDon = idHoaDonChosing;
      } else {
        idHoaDon = idHoaDonChosing;
        existHD = true;
      }
    }

    if (!existHD) {
      realmQuery.HoaDon_ResetValueForColumn_isOpenLastest(idLoaiChungTu);

      const lstHoaDon = realmQuery.GetListHoaDon_ByLoaiChungTu(idLoaiChungTu);

      const max = CommonFunc.getMaxNumberFromMaHoaDon(lstHoaDon);
      const kiHieuMaChungTu =
        idLoaiChungTu == LoaiChungTu.HOA_DON_BAN_LE ? TenLoaiChungTu.HOA_DON_BAN_LE : TenLoaiChungTu.GOI_DICH_VU;

      const newHD = new HoaDonDto({
        id: idHoaDon,
        idLoaiChungTu: idLoaiChungTu,
        maHoaDon: `${kiHieuMaChungTu} ${max}`
      });
      realmQuery.InsertTo_HoaDon(newHD);
    }

    setIdHoaDonChosing(idHoaDon);

    return idHoaDon;
  };

  useEffect(() => {
    getListProduct();
  }, [paramSearchProduct]);

  useEffect(() => {
    if (firstLoad) {
      firstLoad.current = false;
      return;
    }
    const getData = setTimeout(async () => {
      await getListProduct();
      return () => clearTimeout(getData);
    }, 2000);
  }, [txtSearchProduct]);

  const choseProduct = async (item: IProductBasic) => {
    const idQuyDoi = item?.idDonViQuyDoi;

    const itemCTHD = realmQuery.GetChiTietHoaDon_byIdQuyDoi(idHoaDonCurrent, idQuyDoi);

    if (itemCTHD != null) {
      setCTDoing({
        ...ctDoing,
        id: itemCTHD?.id,
        stt: itemCTHD?.stt ?? 1,
        idHoaDon: idHoaDonChosing,
        idDonViQuyDoi: idQuyDoi,
        idHangHoa: item.idHangHoa,
        maHangHoa: item?.maHangHoa ?? '',
        tenHangHoa: item?.tenHangHoa ?? '',
        soLuong: itemCTHD.soLuong,
        donGiaTruocCK: itemCTHD?.donGiaTruocCK ?? 0,
        ptChietKhau: itemCTHD?.ptChietKhau ?? 0,
        tienChietKhau: itemCTHD?.tienChietKhau ?? 0,
        ptThue: itemCTHD?.ptThue ?? 0,
        tienThue: itemCTHD?.tienThue ?? 0,
        donGiaSauCK: itemCTHD?.donGiaSauCK ?? 0,
        thanhTienTruocCK: itemCTHD?.thanhTienTruocCK ?? 0,
        thanhTienSauCK: itemCTHD?.thanhTienSauCK ?? 0,
        thanhTienSauVAT: itemCTHD?.thanhTienSauVAT ?? 0
      });
    } else {
      setCTDoing({
        ...ctDoing,
        stt: 1,
        id: uuid.v4().toString(),
        idHoaDon: idHoaDonChosing,
        maHangHoa: item?.maHangHoa ?? '',
        tenHangHoa: item?.tenHangHoa ?? '',
        idDonViQuyDoi: idQuyDoi,
        idHangHoa: item.idHangHoa,
        soLuong: 1,
        ptChietKhau: 0,
        tienChietKhau: 0,
        laPTChietKhau: true,
        ptThue: 0,
        tienThue: 0,
        donGiaTruocCK: item?.giaBan ?? 0,
        thanhTienTruocCK: item?.giaBan ?? 0,
        donGiaSauCK: item?.giaBan ?? 0,
        thanhTienSauCK: item?.giaBan ?? 0,
        donGiaSauVAT: item?.giaBan ?? 0,
        thanhTienSauVAT: item?.giaBan ?? 0,
        trangThai: InvoiceStatus.HOAN_THANH
      });
    }
    setIsShowModalAddGioHang(true);
  };

  const agreeAddGioHang = async (ctAfter: IHoaDonChiTietDto) => {
    setIsShowModalAddGioHang(false);

    let idHoaDon = GetIdHoaDon_andCreateNewHD_ifNotExist();

    // delete & add again
    const idQuyDoi = ctAfter?.idDonViQuyDoi;
    ctAfter.idHoaDon = idHoaDon;
    realmQuery.DeleteHoaDonChiTiet_byIdQuyDoi(idHoaDon, idQuyDoi);
    realmQuery.InsertTo_HoaDonChiTiet(ctAfter);

    const lstCTHD = realmQuery.GetListChiTietHoaDon_byIdHoaDon(idHoaDon);
    const hdAfter = realmQuery.UpdateHD_fromCTHD(idHoaDon);
    if (hdAfter) {
      setCurrentInvoice({
        ...currentInvoice,
        idHoaDon: idHoaDon,
        countProduct: lstCTHD?.length ?? 0
      });
    }
  };

  const { width, height } = Dimensions.get('screen');

  return (
    <View style={styles.container}>
      <ModalAddGioHang
        isShow={isShowModalAddGioHang}
        objUpdate={ctDoing}
        onClose={() => setIsShowModalAddGioHang(false)}
        onSave={agreeAddGioHang}
      />
      <View style={{ padding: 8 }}>
        <Input
          leftIcon={{
            type: IconType.IONICON,
            name: 'search',
            size: 14,
            style: {
              color: '#ccc'
            }
          }}
          rightIcon={{
            type: IconType.IONICON,
            name: 'add'
          }}
          placeholder="Tìm kiếm sản phẩm"
          containerStyle={{
            // backgroundColor: 'red',
            borderColor: '#ccc',
            padding: 0
          }}
          inputStyle={{
            fontSize: 14
          }}
        />

        {(pageResultProduct?.totalCount ?? 0) == 0 ? (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16
            }}>
            Không có dữ liệu
          </Text>
        ) : (
          <View>
            <View
              style={[
                styles.flexRow,
                styles.boxContainer,
                // do chưa fix dc padding của inputsearch ở trên, nên để margin -20
                {
                  backgroundColor: 'rgba(0,0,0,.03)',
                  marginTop: -20
                }
              ]}>
              <View style={styles.flexRow}>
                <Icon type="font-awesome-5" name="user" size={16} />
                <Text
                  style={{
                    paddingLeft: 10
                  }}>
                  Khach le
                </Text>
              </View>
              <Icon type="material-community" name="chevron-double-right" />
            </View>
            <View
              style={[
                styles.flexRow,
                styles.boxContainer,
                {
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1
                }
              ]}>
              <View style={styles.flexRow}>
                <Icon type="ionicon" name="filter" />
                <Text
                  style={{
                    paddingLeft: 8
                  }}>
                  Tất cả
                </Text>
              </View>
              <View style={styles.flexRow}>
                <Icon type="ionicon" name="checkmark" />
                <Text
                  style={{
                    paddingLeft: 8
                  }}>
                  Chọn nhiều
                </Text>
              </View>
            </View>
            <FlatList
              data={pageResultProduct?.items}
              renderItem={({ item }) => <ItemProductSale item={item} choseItem={choseProduct} />}
              keyExtractor={item => item.idDonViQuyDoi}
              style={{
                paddingBottom: 8
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};
export default ProductSale;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  boxContainer: {
    justifyContent: 'space-between',
    padding: 10
  },
  boxCustomer: {
    backgroundColor: 'yellow',
    padding: 8
  },
  textRightIcon: {
    paddingLeft: 8
  }
});
