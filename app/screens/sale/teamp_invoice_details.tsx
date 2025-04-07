import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Button, Icon, Text } from '@rneui/themed';
import uuid from 'react-native-uuid';
import realmQuery from '../../store/realm/realmQuery';
import { HoaDonChiTietDto, IHoaDonChiTietDto, IHoaDonDto } from '../../services/hoadon/dto';
import { IconType } from '../../enum/IconType';
import CommonFunc from '../../utils/CommonFunc';
import KhachHangService from '../../services/customer/KhachHangService';
import { IKhachHangItemDto } from '../../services/customer/IKhachHangItemDto';
import Customer from '../customers/customers';
import { ActionType } from '../../enum/ActionType';
import { ModalListProduct } from './modal_list_product';
import { IProductBasic } from '../../services/product/dto';
import { SimpleDialog } from '../../components/simple_dialog';
import { IPropsSimpleDialog } from '../../type/IPropsSimpleDialog';
import { SaleManagerStackParamList } from '../../navigation/route_param_list';
import { SaleManagerStack } from '../../navigation/list_name_route';
import { useSaleManagerStackContext } from '../../store/react_context/SaleManagerStackProvide';

type ScreensTempInvoiceDetailsNavigationProps = NativeStackNavigationProp<
  SaleManagerStackParamList,
  SaleManagerStack.TEMP_INVOICE_DETAIL
>;

type ScreensTempInvoiceDetailRouteProp = RouteProp<SaleManagerStackParamList, SaleManagerStack.TEMP_INVOICE_DETAIL>;

export const TempInvoiceDetails = () => {
  const route = useRoute<ScreensTempInvoiceDetailRouteProp>();
  const navigation = useNavigation<ScreensTempInvoiceDetailsNavigationProps>();
  const { currentInvoice, setCurrentInvoice } = useSaleManagerStackContext();
  const idHoaDon = currentInvoice?.idHoaDon ?? '';

  const [txtSearchProduct, setTxtSearchProduct] = useState('');
  const [isShowModalCustomer, setIsShowModalCustomer] = useState(false);
  const [isShowModalAddProduct, setIsShowModalAddProduct] = useState(false);
  const [lstCTHD, setLstCTHD] = useState<IHoaDonChiTietDto[]>([]);
  const [hoadonOpen, setHoaDonOpen] = useState<IHoaDonDto>({
    id: ''
  } as IHoaDonDto);

  const [custonerChosing, setCustonerChosing] = useState<IKhachHangItemDto>();
  const [objSimpleDialog, setObjSimpleDialog] = useState<IPropsSimpleDialog>();

  useEffect(() => {
    GetDataHoaDon_fromCache(idHoaDon);
  }, [idHoaDon]);

  const lstSearchCTHD = lstCTHD?.filter(
    x =>
      CommonFunc.convertString_toEnglish(x.tenHangHoa).indexOf(CommonFunc.convertString_toEnglish(txtSearchProduct)) >
      -1
  );

  const GetDataHoaDon_fromCache = async (idHoaDon: string) => {
    const hd = realmQuery.GetHoaDon_byId(idHoaDon);
    const lst = realmQuery.GetListChiTietHoaDon_byIdHoaDon(idHoaDon);
    if (hd != null) {
      setHoaDonOpen({
        ...hd
      });
      setLstCTHD([...lst]);
      getInforCustomer(hd?.idKhachHang ?? '');

      navigation.setOptions({
        title: hd?.maHoaDon
      });
    }
  };

  const getInforCustomer = async (idKhachHang: string) => {
    if (CommonFunc.checkNull_OrEmpty(idKhachHang)) {
      const kle: IKhachHangItemDto = {
        id: '',
        idKhachHang: null,
        maKhachHang: 'KL',
        tenKhachHang: 'Khách lẻ',
        soDienThoai: ''
      };
      setCustonerChosing({
        ...kle
      });
    } else {
      const data = await KhachHangService.getDetail(idKhachHang);
      setCustonerChosing({
        ...data
      });
    }
  };

  const CaculatorHD_byTongTienHang = (tongTienHang: number) => {
    let ptGiamGiaHD = hoadonOpen.ptGiamGiaHD;
    let giamgiaHD = hoadonOpen.tongGiamGiaHD;
    let tongThue = hoadonOpen.tongTienThue;
    if (tongTienHang > 0) {
      if (ptGiamGiaHD > 0) {
        giamgiaHD = ((tongTienHang + tongThue) * ptGiamGiaHD) / 100;
      } else {
        if (giamgiaHD > tongTienHang) {
          giamgiaHD = 0;
        }
      }
    } else {
      giamgiaHD = 0;
      tongThue = 0;
    }
    let tongThanhToan = tongTienHang + tongThue - giamgiaHD;

    setHoaDonOpen({
      ...hoadonOpen,
      tongGiamGiaHD: giamgiaHD,
      tongTienThue: tongThue,
      tongTienHangChuaChietKhau: tongTienHang, // todo
      tongTienHang: tongTienHang,
      tongTienHDSauVAT: tongTienHang + tongThue,
      tongThanhToan: tongThanhToan
    });
    realmQuery.UpdateHD_fromCTHD(hoadonOpen?.id);
  };

  const tangSoLuong = async (item: IHoaDonChiTietDto) => {
    const slNew = item.soLuong + 1;
    setLstCTHD(
      lstCTHD?.map(x => {
        if (x.id === item.id) {
          return {
            ...x,
            soLuong: slNew,
            thanhTienTruocCK: slNew * item?.donGiaTruocCK,
            thanhTienSauCK: slNew * item?.donGiaSauCK,
            thanhTienSauVAT: slNew * item?.donGiaSauVAT
          };
        } else {
          return x;
        }
      })
    );
    item.soLuong = slNew;
    item.thanhTienTruocCK = slNew * item?.donGiaTruocCK;
    item.thanhTienSauCK = slNew * item?.donGiaTruocCK;
    item.thanhTienSauVAT = slNew * item?.donGiaSauVAT;
    realmQuery.UpdateTo_HoaDonChiTiet(item);

    let tongtien = hoadonOpen.tongTienHang + item?.donGiaSauCK;
    CaculatorHD_byTongTienHang(tongtien);
  };

  const giamSoLuong = async (item: IHoaDonChiTietDto) => {
    let slNew = item.soLuong;
    if (slNew > 1) {
      slNew = slNew - 1;
      setLstCTHD(
        lstCTHD?.map(x => {
          if (x.id === item.id) {
            return {
              ...x,
              soLuong: slNew,
              thanhTienTruocCK: slNew * item?.donGiaTruocCK,
              thanhTienSauCK: slNew * item?.donGiaSauCK,
              thanhTienSauVAT: slNew * item?.donGiaSauVAT
            };
          } else {
            return x;
          }
        })
      );
      item.soLuong = slNew;
      item.thanhTienTruocCK = slNew * item?.donGiaTruocCK;
      item.thanhTienSauCK = slNew * item?.donGiaTruocCK;
      item.thanhTienSauVAT = slNew * item?.donGiaSauVAT;

      realmQuery.UpdateTo_HoaDonChiTiet(item);
    } else {
      // remove from list
      setLstCTHD(lstCTHD?.filter(x => x.id !== item.id));
      realmQuery.DeleteHoaDonChiTiet_byId(item.id);

      setCurrentInvoice({
        ...currentInvoice,
        countProduct: (lstCTHD?.length ?? 0) - 1
      });
    }
    let tongtien = hoadonOpen.tongTienHang - item?.donGiaSauCK;
    CaculatorHD_byTongTienHang(tongtien);
  };

  const showModalCustomer = () => {
    setIsShowModalCustomer(true);
  };
  const choseCustomer = (cusChosed: IKhachHangItemDto) => {
    setIsShowModalCustomer(false);
    setCustonerChosing({
      ...cusChosed
    });
    setHoaDonOpen({
      ...hoadonOpen,
      idKhachHang: cusChosed?.id
    });
    realmQuery.UpdateKhachHang_toHoaDon(hoadonOpen?.id, cusChosed?.id);
  };

  const addNewProduct = (productChosed: IProductBasic) => {
    // check exists
    const ctOld = realmQuery.GetChiTietHoaDon_byIdQuyDoi(idHoaDon, productChosed?.idDonViQuyDoi);
    if (ctOld) {
      setObjSimpleDialog({
        ...objSimpleDialog,
        isShow: true,
        title: 'Thông báo',
        mes: 'Sản phẩm ' + productChosed?.tenHangHoa + ' đã được chọn'
      });
      return;
    }
    const ctNew = new HoaDonChiTietDto({
      id: uuid.v4().toString(),
      idHoaDon: idHoaDon,
      idDonViQuyDoi: productChosed?.idDonViQuyDoi,
      idHangHoa: productChosed?.idHangHoa,
      maHangHoa: productChosed?.maHangHoa,
      tenHangHoa: productChosed?.tenHangHoa,
      soLuong: 1,
      giaBan: productChosed?.giaBan,
      donGiaTruocCK: productChosed?.giaBan
    });
    setLstCTHD([ctNew, ...lstCTHD]);
    realmQuery.InsertTo_HoaDonChiTiet(ctNew);
    const hdAfter = realmQuery.UpdateHD_fromCTHD(idHoaDon);
    if (hdAfter) {
      setHoaDonOpen({
        ...hoadonOpen,
        tongTienHang: hdAfter?.tongTienHang,
        tongTienHangChuaChietKhau: hdAfter?.tongTienHangChuaChietKhau,
        tongTienHDSauVAT: hdAfter?.tongTienHDSauVAT,
        tongThanhToan: hdAfter?.tongThanhToan
      });
    }

    setIsShowModalAddProduct(false);
    setCurrentInvoice({
      ...currentInvoice,
      countProduct: (lstCTHD?.length ?? 0) + 1
    });
  };

  const gotoThanhToan = () => {
    navigation.navigate(SaleManagerStack.THANH_TOAN);
    setCurrentInvoice({
      ...currentInvoice,
      tongPhaiTra: hoadonOpen?.tongThanhToan ?? 0
    });
  };

  return (
    <View style={styles.container}>
      <Customer
        isShow={isShowModalCustomer}
        objUpdate={custonerChosing}
        onClose={() => setIsShowModalCustomer(false)}
        onSave={choseCustomer}
      />
      <SimpleDialog
        isShow={objSimpleDialog?.isShow ?? false}
        title={objSimpleDialog?.title}
        mes={objSimpleDialog?.mes}
        onClose={() =>
          setObjSimpleDialog({
            ...objSimpleDialog,
            isShow: false
          })
        }
      />
      <ModalListProduct
        isShow={isShowModalAddProduct}
        onClose={() => setIsShowModalAddProduct(false)}
        onSave={addNewProduct}
      />
      <View style={styles.boxCustomer}>
        <View style={styles.boxCustomer_LeftRight}>
          <Icon size={18} type={IconType.FONT_AWESOME_5} name="user" />
          <View
            style={{
              gap: 8
            }}>
            <Text
              style={{
                fontWeight: 500
              }}>
              {custonerChosing?.tenKhachHang ?? 'Khách lẻ'}
            </Text>
            {custonerChosing?.soDienThoai && (
              <Text
                style={{
                  fontSize: 13,
                  color: '#666666'
                }}>
                {custonerChosing?.soDienThoai}
              </Text>
            )}
          </View>
        </View>
        <Pressable style={styles.boxCustomer_LeftRight} onPress={showModalCustomer}>
          <Text
            style={{
              textDecorationLine: 'underline',
              fontSize: 12
            }}>
            Chọn lại khách
          </Text>
          <Icon name="arrow-forward-ios" type={IconType.MATERIAL} size={20} />
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 8
        }}>
        <View
          style={{
            borderRadius: 4,
            borderColor: '#ccc',
            borderWidth: 1,
            flex: 3,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: 'white'
          }}>
          <Icon type={IconType.IONICON} name="search" size={18} />
          <TextInput
            style={{
              marginLeft: 8
            }}
            placeholder="Tìm dịch vụ"
            value={txtSearchProduct}
            onChangeText={text => setTxtSearchProduct(text)}
          />
        </View>

        <Pressable
          style={{
            flex: 1,
            marginLeft: 8,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => setIsShowModalAddProduct(true)}>
          <Text
            style={{
              textDecorationLine: 'underline',
              fontSize: 12,
              color: 'blue',
              textAlign: 'center'
            }}>
            Thêm sản phẩm vào giỏ hàng
          </Text>
        </Pressable>
      </View>
      {lstSearchCTHD?.length == 0 ? (
        <View style={styles.container}>
          <View
            style={{
              gap: 12,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white'
            }}>
            <Icon type={IconType.FOUNDATION} name="page-add" size={20} />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16
              }}>
              Chưa có sản phẩm
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.containerDetail}>
          <View
            style={{
              gap: 8,
              backgroundColor: 'white'
            }}>
            {lstSearchCTHD?.map((item, index) => (
              <View
                key={item?.id}
                style={{
                  borderBottomWidth: index < lstSearchCTHD?.length - 1 ? 1 : 0,
                  borderBlockColor: '#ccc',
                  padding: 8
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                  <View
                    style={{
                      gap: 8
                    }}>
                    <Text
                      style={{
                        fontWeight: 500
                      }}>
                      {item?.tenHangHoa}
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        color: 'rgb(178, 183, 187)'
                      }}>
                      {new Intl.NumberFormat('vi-VN').format(item?.donGiaSauCK)}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10
                    }}>
                    <Icon
                      type={IconType.IONICON}
                      name="remove-circle-outline"
                      size={30}
                      color={'#ccc'}
                      onPress={() => giamSoLuong(item)}
                    />
                    <Text
                      style={{
                        fontSize: 18
                      }}>
                      {item?.soLuong}
                    </Text>
                    <Icon
                      type={IconType.IONICON}
                      name="add-circle-outline"
                      size={30}
                      color={'#ccc'}
                      onPress={() => tangSoLuong(item)}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.boxInvoice}>
        <View
          style={{
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#ccc'
          }}>
          <View
            style={{
              gap: 12
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
              <Text>Tổng tiền hàng</Text>
              <Text
                style={{
                  fontSize: 18
                }}>
                {new Intl.NumberFormat('vi-VN').format(hoadonOpen?.tongTienHang)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
              <Text>Giảm giá</Text>
              <Text
                style={{
                  fontSize: 18
                }}>
                {new Intl.NumberFormat('vi-VN').format(hoadonOpen?.tongGiamGiaHD)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
              <Text>Tổng cộng</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 500
                }}>
                {new Intl.NumberFormat('vi-VN').format(hoadonOpen?.tongThanhToan)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <Button
        titleStyle={{
          fontSize: 18
          //color: 'white'
        }}
        size="lg"
        containerStyle={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: 8
        }}
        buttonStyle={{
          //backgroundColor: '#D7681D',
          borderRadius: 4
        }}
        onPress={gotoThanhToan}>
        <Icon
          name="check"
          color="white"
          containerStyle={{
            marginRight: 10
          }}
        />
        Thanh toán
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(245, 247, 244)',
    flex: 1,
    position: 'relative'
  },
  boxInvoice: {
    bottom: 75,
    position: 'absolute',
    width: '100%',
    padding: 8,
    backgroundColor: 'white'
  },
  boxCustomer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#DAE8FC'
  },
  boxCustomer_LeftRight: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  containerDetail: {
    padding: 8
  }
});
