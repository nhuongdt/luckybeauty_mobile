import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, CheckBox, Icon, Input, SearchBar, useTheme } from '@rneui/themed';
import uuid from 'react-native-uuid';
import { Text, Theme } from '@rneui/base';
import ModalAddGioHang from './modal_add_gio_hang';
import realmQuery from '../../store/realm/realmQuery';
import { HoaDonChiTietDto, HoaDonDto, IHoaDonChiTietDto } from '../../services/hoadon/dto';
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
import { ActionMenu } from '../components/action_menu';
import { IProductGroupDto } from '../../services/product_group/dto';
import ProductGroupSevice from '../../services/product_group/ProductGroupSevice';

type ProductSaleNavigationProps = NativeStackNavigationProp<SaleManagerTabParamList, SaleManagerTab.PRODUCT>;

type ProductSaleRouteProp = RouteProp<SaleManagerTabParamList, SaleManagerTab.PRODUCT>;

const ProductSale = () => {
  const firstLoad = useRef(true);
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const route = useRoute<ProductSaleRouteProp>();
  const navigation = useNavigation<ProductSaleNavigationProps>();
  const { currentInvoice, setCurrentInvoice, setIsHideTab } = useSaleManagerStackContext();
  const idHoaDonCurrent = currentInvoice?.idHoaDon ?? '';
  const idLoaiChungTu = currentInvoice?.idLoaiChungTu ?? LoaiChungTu.HOA_DON_BAN_LE;

  const [idHoaDonChosing, setIdHoaDonChosing] = useState('');
  const [isShowModalAddGioHang, setIsShowModalAddGioHang] = useState(false);
  const [txtSearchProduct, setTxtSearchProduct] = useState('');
  const [isCheckMultipleProduct, setIsCheckMultipleProduct] = useState(false);
  const [arrIdQuyDoiChosed, setArrIdQuyDoiChosed] = useState<string[]>([]);
  const [arrIdNhomHangFilter, setArrIdNhomHangFilter] = useState<string[]>([]);
  const [ctDoing, setCTDoing] = useState<IHoaDonChiTietDto>({} as IHoaDonChiTietDto);
  const [listGroupProduct, setListGroupProduct] = useState<IProductGroupDto[]>([]);

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

  const GetAllNhomSanPham = async () => {
    const lst = await ProductGroupSevice.GetAllNhomHangHoa();
    if (lst?.length > 0) {
      setListGroupProduct([...lst]);
    } else {
      const arr: IProductGroupDto[] = [
        {
          id: '1',
          tenNhomHang: 'Phẫu thuật thẩm mỹ'
        },
        {
          id: '2',
          tenNhomHang: 'Gội'
        },
        {
          id: '3',
          tenNhomHang: 'Phun xăm'
        },
        {
          id: '4',
          tenNhomHang: 'Sản phẩm chăm sóc sắc đẹp'
        }
      ];
      setListGroupProduct([...arr]);
    }
  };

  useEffect(() => {
    if (setIsHideTab !== undefined) {
      setIsHideTab(isCheckMultipleProduct);
    }
  }, [isCheckMultipleProduct]);

  const PageLoad = async () => {
    GetAllNhomSanPham();
  };

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

  const choseNhomHangHoa = async (idNhomHang: string) => {
    setArrIdNhomHangFilter(prev => {
      if (!prev.includes(idNhomHang)) {
        return [idNhomHang, ...prev];
      } else {
        return prev.filter(x => x !== idNhomHang);
      }
    });
    // todo: get listproduct by arrNhomFilter
  };

  const choseProduct = async (item: IProductBasic) => {
    const idQuyDoi = item?.idDonViQuyDoi;
    if (isCheckMultipleProduct) {
      setArrIdQuyDoiChosed(prev => {
        if (!prev.includes(idQuyDoi)) {
          return [idQuyDoi, ...prev];
        } else {
          return prev.filter(x => x !== idQuyDoi);
        }
      });
      return;
    }

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

  const clickBoChonNhieuSanPham = () => {
    setIsCheckMultipleProduct(false);
    setArrIdQuyDoiChosed([]);
  };
  const addMultipleProduct = async () => {
    setIsCheckMultipleProduct(false);
    setArrIdQuyDoiChosed([]);

    const cthd = realmQuery.GetListChiTietHoaDon_byIdHoaDon(idHoaDonCurrent);
    const arrIdQuyDoiOld = cthd?.map(x => {
      return x.idDonViQuyDoi;
    });
    const arrIdQuyDoiNew = arrIdQuyDoiChosed?.filter(x => !arrIdQuyDoiOld.includes(x));

    // if exists: increments quantity
    for (let i = 0; i < arrIdQuyDoiOld.length; i++) {
      const idQuyDoi = arrIdQuyDoiOld[i];
      for (let j = 0; j < cthd.length; j++) {
        const itemCTHD = cthd[j];
        if (itemCTHD.idDonViQuyDoi === idQuyDoi) {
          itemCTHD.soLuong += 1;
          itemCTHD.thanhTienTruocCK += itemCTHD.donGiaTruocCK * itemCTHD.soLuong;
          itemCTHD.thanhTienSauCK += itemCTHD.donGiaSauCK * itemCTHD.soLuong;
          itemCTHD.thanhTienSauVAT += itemCTHD.donGiaSauVAT * itemCTHD.soLuong;

          realmQuery.UpdateTo_HoaDonChiTiet(itemCTHD);
          break;
        }
      }
    }
    // if not: add new
    const lstProductNew_fromCache = realmQuery.GetListHangHoa_byArrIdQuyDoi(arrIdQuyDoiNew);
    for (let i = 0; i < lstProductNew_fromCache.length; i++) {
      const productNew = lstProductNew_fromCache[i];
      const newCTHD = new HoaDonChiTietDto({
        id: uuid.v4().toString(),
        idHoaDon: idHoaDonCurrent,
        idDonViQuyDoi: productNew?.idDonViQuyDoi,
        idHangHoa: productNew?.idHangHoa,
        maHangHoa: productNew?.maHangHoa,
        tenHangHoa: productNew?.tenHangHoa,
        giaBan: productNew?.giaBan ?? 0,
        soLuong: 1,
        donGiaTruocCK: productNew?.giaBan ?? 0
      });
      cthd.push(newCTHD);
      realmQuery.InsertTo_HoaDonChiTiet(newCTHD);
    }

    realmQuery.UpdateHD_fromCTHD(idHoaDonCurrent);

    // get list product from DB (todo)
    // const arrProduct = await ProductService.GetInforBasic_OfListHangHoa_ByIdQuyDoi(arrIdQuyDoiNew);

    setCurrentInvoice({
      ...currentInvoice,
      countProduct: (currentInvoice?.countProduct ?? 0) + (arrIdQuyDoiNew?.length ?? 0)
    });

    setIsCheckMultipleProduct(false);
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
        <View style={[styles.flexRow, styles.boxContainer]}>
          <TouchableOpacity style={styles.flexRow}>
            <ScrollView horizontal>
              <Button
                containerStyle={{ paddingRight: 6, paddingVertical: 6 }}
                buttonStyle={{
                  borderRadius: 4,
                  backgroundColor: arrIdNhomHangFilter?.length > 0 ? theme.colors.disabled : theme.colors.primary
                }}
                title={'Tất cả'}></Button>
              {listGroupProduct?.map(item => (
                <Button
                  key={item?.id}
                  title={item.tenNhomHang}
                  containerStyle={{ padding: 6 }}
                  buttonStyle={{
                    borderRadius: 4,
                    backgroundColor: arrIdNhomHangFilter?.includes(item?.id)
                      ? theme.colors.primary
                      : theme.colors.disabled
                  }}
                  onPress={() => choseNhomHangHoa(item?.id)}></Button>
              ))}
            </ScrollView>
            {/* <Text
              style={{
                paddingLeft: 8
              }}>
              Nhóm hàng:
            </Text>
            <Text
              style={{
                paddingLeft: 8
              }}>
              Tất cả
            </Text> */}
          </TouchableOpacity>
        </View>
        <Input
          leftIcon={{
            type: IconType.IONICON,
            name: 'search',
            size: 14,
            style: {
              color: theme.colors.greyOutline
            }
          }}
          rightIcon={{
            type: IconType.IONICON,
            name: 'add'
          }}
          placeholder="Tìm kiếm sản phẩm"
          containerStyle={{
            borderColor: theme.colors.greyOutline,
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
              style={{
                padding: 12,
                marginTop: -20
              }}>
              <View style={[styles.flexRow, { justifyContent: 'space-between' }]}>
                <TouchableOpacity
                  onPress={() => setIsCheckMultipleProduct(!isCheckMultipleProduct)}
                  style={styles.flexRow}>
                  {isCheckMultipleProduct && <Icon type="ionicon" name="checkmark" />}
                  <Text
                    style={{
                      textDecorationLine: 'underline',
                      color: theme.colors.primary
                    }}>
                    Chọn nhiều sản phẩm
                  </Text>
                </TouchableOpacity>
                {isCheckMultipleProduct && (
                  <TouchableOpacity onPress={clickBoChonNhieuSanPham}>
                    <Text
                      style={{
                        textDecorationLine: 'underline',
                        color: theme.colors.primary
                      }}>
                      Bỏ chọn nhiều
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <FlatList
              data={pageResultProduct?.items}
              renderItem={({ item }) => (
                <ItemProductSale
                  item={item}
                  isShowCheck={isCheckMultipleProduct}
                  isChosed={arrIdQuyDoiChosed.includes(item.idDonViQuyDoi)}
                  choseItem={choseProduct}
                />
              )}
              keyExtractor={item => item.idDonViQuyDoi}
              style={{
                paddingBottom: 8
              }}
            />
          </View>
        )}
      </View>
      {isCheckMultipleProduct && (
        <ActionMenu
          visible={isCheckMultipleProduct}
          enable={arrIdQuyDoiChosed?.length > 0}
          onPress={addMultipleProduct}
        />
      )}
    </View>
  );
};
export default ProductSale;
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.white,
      position: 'relative'
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    boxContainer: {
      justifyContent: 'space-between',
      padding: 10
    },
    textRightIcon: {
      paddingLeft: 8
    },
    actionMenu: {
      backgroundColor: theme.colors.primary,
      gap: 8,
      padding: 10,
      position: 'absolute',
      bottom: 0,
      width: '100%',
      justifyContent: 'center'
    }
  });
