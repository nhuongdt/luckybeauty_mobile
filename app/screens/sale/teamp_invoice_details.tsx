import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Button, Icon} from '@rneui/themed';
import realmDatabase from '../../store/realm/database';
import realmQuery from '../../store/realm/realmQuery';
import {IHoaDonChiTietDto, IHoaDonDto} from '../../services/hoadon/dto';
import {BottomTabParamList} from '../../navigation/sale_navigation';
import {ListBottomTab} from '../../enum/ListBottomTab';
import {SearchBar, Text} from '@rneui/base';
import {IconType} from '../../enum/IconType';
import CommonFunc from '../../utils/CommonFunc';

type TempInvoiceDetailsProps = NativeStackNavigationProp<
  BottomTabParamList,
  ListBottomTab.TEMP_INVOICE_DETAIL
>;

type InvoiceDetailRouteProp = RouteProp<
  {params: {idHoaDon: string; tongThanhToan: number}},
  'params'
>;

export const TempInvoiceDetails = () => {
  const route = useRoute<InvoiceDetailRouteProp>();
  const navigation = useNavigation<TempInvoiceDetailsProps>();
  const {idHoaDon = '', tongThanhToan = 0} = route.params || {};
  const db = realmDatabase;
  const [txtSearchProduct, setTxtSearchProduct] = useState('');
  const [lstCTHD, setLstCTHD] = useState<IHoaDonChiTietDto[]>([]);
  // const [lstSearchCTHD, setLstSearchCTHD] = useState<IHoaDonChiTietDto[]>([]);
  const [hoadonOpen, setHoaDonOpen] = useState<IHoaDonDto>({
    id: idHoaDon,
  } as IHoaDonDto);

  // useEffect(() => {
  //   const txt = CommonFunc.convertString_toEnglish(txtSearchProduct);
  //   const lst = lstCTHD?.filter(
  //     x => CommonFunc.convertString_toEnglish(x.tenHangHoa).indexOf(txt) > -1,
  //   );
  //   setLstSearchCTHD([...lst]);
  // }, [txtSearchProduct]);

  const lstSearchCTHD = lstCTHD?.filter(
    x =>
      CommonFunc.convertString_toEnglish(x.tenHangHoa).indexOf(
        CommonFunc.convertString_toEnglish(txtSearchProduct),
      ) > -1,
  );

  const GetDataHoaDon_fromCache = async () => {
    const hd = realmQuery.GetHoaDon_byId(db, idHoaDon);
    const lst = realmQuery.GetListChiTietHoaDon_byIdHoaDon(db, idHoaDon);
    if (hd != null) {
      setHoaDonOpen({...hd});
      setLstCTHD([...lst]);
    }
  };

  useEffect(() => {
    GetDataHoaDon_fromCache();
  }, [idHoaDon, tongThanhToan]);

  const CaculatorHD_byTongTienHang = async (tongTienHang: number) => {
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
      tongThanhToan: tongThanhToan,
    });
    realmQuery.UpdateHD_fromCTHD(db, idHoaDon);
    navigation.setParams({
      tongThanhToan: tongThanhToan,
    });
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
            thanhTienSauVAT: slNew * item?.donGiaSauVAT,
          };
        } else {
          return x;
        }
      }),
    );
    item.soLuong = slNew;
    realmQuery.UpdateTo_HoaDonChiTiet(item);

    let tongtien = hoadonOpen.tongTienHang + item.donGiaSauCK;
    await CaculatorHD_byTongTienHang(tongtien);
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
              thanhTienSauVAT: slNew * item?.donGiaSauVAT,
            };
          } else {
            return x;
          }
        }),
      );
      item.soLuong = slNew;
      realmQuery.UpdateTo_HoaDonChiTiet(item);
    } else {
      // remove from list
      setLstCTHD(lstCTHD?.filter(x => x.id !== item.id));
      realmQuery.DeleteHoaDonChiTiet_byId(item.id);
    }
    let tongtien = hoadonOpen.tongTienHang - item.donGiaSauCK;
    await CaculatorHD_byTongTienHang(tongtien);
  };
  if (lstSearchCTHD?.length === 0) {
    return (
      <View style={styles.container}>
        <View
          style={{
            gap: 12,
            flex: 1,
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <Icon type={IconType.FOUNDATION} name="page-add" size={20} />
          <Text style={{textAlign: 'center', fontSize: 16}}>
            Chưa có sản phẩm
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.boxCustomer}>
        <View style={styles.boxCustomer_LeftRight}>
          <Icon size={18} type={IconType.FONT_AWESOME_5} name="user" />
          <View style={{gap: 8}}>
            <Text style={{fontWeight: 500}}>Nguyen Thi Thu Huong</Text>
            <Text style={{fontSize: 13}}>02562853655</Text>
          </View>
        </View>
        <Pressable
          style={styles.boxCustomer_LeftRight}
          onPress={() =>
            navigation.navigate(ListBottomTab.CUSTOMER, {
              idKhachHang: hoadonOpen?.idKhachHang ?? '',
            })
          }>
          <Text style={{textDecorationLine: 'underline', fontSize: 12}}>
            Chọn lại khách
          </Text>
          <Icon name="arrow-forward-ios" type={IconType.MATERIAL} size={20} />
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <SearchBar
          placeholder="Tìm kiếm dịch vụ"
          value={txtSearchProduct}
          onChangeText={text => setTxtSearchProduct(text)}
          containerStyle={{
            borderTopWidth: 0,
            borderBottomColor: '#ccc',
            backgroundColor: 'white',
            flex: 3,
          }}
          inputStyle={{fontSize: 14}}
          inputContainerStyle={{backgroundColor: 'white'}}
        />
        <Text style={{textDecorationLine: 'underline', fontSize: 12, flex: 2}}>
          Thêm sản phẩm vào giỏ
        </Text>
      </View>

      <View style={styles.containerDetail}>
        <View style={{gap: 8}}>
          {lstSearchCTHD?.map((item, index) => (
            <View
              key={item?.id}
              style={{
                borderBottomWidth: index < lstSearchCTHD?.length - 1 ? 1 : 0,
                borderBlockColor: '#ccc',
                padding: 8,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{gap: 8}}>
                  <Text style={{fontWeight: 500}}>{item?.tenHangHoa}</Text>
                  <Text style={{fontSize: 18, color: 'rgb(178, 183, 187)'}}>
                    {new Intl.NumberFormat('vi-VN').format(item?.donGiaSauCK)}
                  </Text>
                </View>

                <View style={{flexDirection: 'row', gap: 10}}>
                  <Icon
                    type={IconType.IONICON}
                    name="remove-circle-outline"
                    size={30}
                    color={'#ccc'}
                    onPress={() => giamSoLuong(item)}
                  />
                  <Text style={{fontSize: 18}}>{item?.soLuong}</Text>
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

      <View style={styles.boxInvoice}>
        <View style={{gap: 12}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Tổng tiền hàng</Text>
            <Text style={{fontSize: 18}}>
              {new Intl.NumberFormat('vi-VN').format(hoadonOpen?.tongTienHang)}
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Giảm giá</Text>
            <Text style={{fontSize: 18}}>
              {new Intl.NumberFormat('vi-VN').format(hoadonOpen?.tongGiamGiaHD)}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>Tổng cộng</Text>
            <Text style={{fontSize: 18, fontWeight: 500}}>
              {new Intl.NumberFormat('vi-VN').format(hoadonOpen?.tongThanhToan)}
            </Text>
          </View>
        </View>
      </View>
      <Button
        titleStyle={{fontSize: 18, color: 'white'}}
        size="lg"
        containerStyle={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: 8,
        }}
        buttonStyle={{
          backgroundColor: '#D7681D',
          borderRadius: 4,
        }}>
        <Icon name="check" color="white" containerStyle={{marginRight: 10}} />
        Thanh toán
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(245, 247, 244)',
    flex: 1,
    position: 'relative',
  },
  boxInvoice: {
    bottom: 75,
    backgroundColor: 'white',
    position: 'absolute',
    width: '100%',
    padding: 16,
  },
  boxCustomer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#DAE8FC',
  },
  boxCustomer_LeftRight: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  containerDetail: {
    padding: 16,
    flex: 1,
    backgroundColor: 'white',
  },
});
