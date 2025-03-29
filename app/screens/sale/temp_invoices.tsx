import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Icon, Button, Text, useTheme } from '@rneui/themed';
import { useEffect, useRef, useContext, useState, useCallback } from 'react';
import uuid from 'react-native-uuid';
import { format } from 'date-fns';
import { CompositeNavigationProp, CompositeScreenProps, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Input } from '@rneui/base';
import realmQuery from '../../store/realm/realmQuery';
import { HoaDonDto, IHoaDonDto } from '../../services/hoadon/dto';
import { LoaiChungTu, TenLoaiChungTu } from '../../enum/LoaiChungTu';
import CommonFunc from '../../utils/CommonFunc';
import { IconType } from '../../enum/IconType';
import PageEmpty from '../../components/page_empty';
import { TempInvoiceDetails } from './teamp_invoice_details';
import { ActionType } from '../../enum/ActionType';
import { SaleManagerStack, SaleManagerTab } from '../../navigation/list_name_route';
import { SaleManagerStackParamList, SaleManagerTabParamList } from '../../navigation/route_param_list';
import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// type TempInvoicekNavigationProps = NativeStackNavigationProp<SaleManagerTabParamList>;
type TempInvoicekNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<SaleManagerTabParamList, SaleManagerTab.TEMP_INVOICE>,
  NativeStackNavigationProp<SaleManagerStackParamList>
>;

type TempInvoiceRouteProp = RouteProp<
  SaleManagerTabParamList,
  SaleManagerTab.TEMP_INVOICE
>;

const styleHeader = StyleSheet.create({
  boxItem: {
    gap: 8,
    minWidth: 120,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  boxItemActive: {
    backgroundColor: '#FA6800'
  },
  boxItemNotActive: {
    backgroundColor: '#F5F5F5'
  },
  boxAdd: {
    backgroundColor: 'white'
  }
});

const TempInvoices = () => {
  const { theme } = useTheme();
  const firstLoad = useRef(true);
  const navigation = useNavigation<TempInvoicekNavigationProps>();
  const route = useRoute<TempInvoiceRouteProp>();

  const [lstHoaDon, setLstHoaDon] = useState<IHoaDonDto[]>([]);
  const [tabActive, setTabActive] = useState(LoaiChungTu.HOA_DON_BAN_LE);

  const arrTab = [
    { id: LoaiChungTu.HOA_DON_BAN_LE, text: 'Hóa đơn' },
    { id: LoaiChungTu.GOI_DICH_VU, text: 'Gói dịch vụ' }
  ];

  const getHoaDonFromCache = (idLoaiChungTu = LoaiChungTu.HOA_DON_BAN_LE) => {
    const data = realmQuery.GetListHoaDon_ByLoaiChungTu(idLoaiChungTu);
    setLstHoaDon([...data]);
  };

  useEffect(() => {
    getHoaDonFromCache();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getHoaDonFromCache(tabActive);
    });

    return unsubscribe; // Cleanup khi component bị unmount
  }, [navigation, tabActive]);

  const createNewInvoice = () => {
    const max = CommonFunc.getMaxNumberFromMaHoaDon(lstHoaDon);
    const kiHieuMaChungTu =
      tabActive == LoaiChungTu.HOA_DON_BAN_LE ? TenLoaiChungTu.HOA_DON_BAN_LE : TenLoaiChungTu.GOI_DICH_VU;

    const newHD = new HoaDonDto({
      id: uuid.v4().toString(),
      idLoaiChungTu: tabActive,
      maHoaDon: `${kiHieuMaChungTu} ${max}`
    });
    setLstHoaDon([newHD, ...lstHoaDon]);

    realmQuery.HoaDon_ResetValueForColumn_isOpenLastest(tabActive);
    realmQuery.InsertTo_HoaDon(newHD);

    navigation.navigate(SaleManagerTab.PRODUCT, {
      idHoaDon: newHD?.id,
      idLoaiChungTu: tabActive
    });
  };

  const onChangeTab = (tabActive: number) => {
    getHoaDonFromCache(tabActive);
    setTabActive(tabActive);
  };

  const removeInvoice = async (id: string) => {
    realmQuery.RemoveHoaDon_byId(id);
    realmQuery.DeleteHoaDonChiTiet_byIdHoaDon(id);
    setLstHoaDon(lstHoaDon?.filter(x => x.id !== id));
  };

  const goInvoiceDetail = (item: IHoaDonDto) => {
    navigation.navigate(SaleManagerStack.TEMP_INVOICE_DETAIL, { idHoaDon: item.id });
  };

  const gotoEdit = (item: IHoaDonDto) => {
    navigation.navigate(SaleManagerTab.PRODUCT, {
      idHoaDon: item.id,
      idLoaiChungTu: tabActive
    });
  };

  const agreeEditChiTiet = (hdAfter: IHoaDonDto, actionId?: number) => {
    setLstHoaDon(
      lstHoaDon?.map(x => {
        if (x.id == hdAfter?.id) {
          return {
            ...x,
            tongTienThue: hdAfter?.tongTienThue,
            tongTienHangChuaChietKhau: hdAfter?.tongTienHangChuaChietKhau,
            tongTienHang: hdAfter?.tongTienHang,
            tongTienHDSauVAT: hdAfter?.tongTienHDSauVAT,
            tongThanhToan: hdAfter?.tongThanhToan,
            idKhachHang: hdAfter?.idKhachHang
          };
        } else {
          return x;
        }
      })
    );

    if (actionId === ActionType.INSERT) {
      navigation.navigate(SaleManagerTab.PRODUCT, {
        idHoaDon: hdAfter?.id,
        idLoaiChungTu: tabActive
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 8,
          backgroundColor: '#FFF2CC'
        }}>
        {arrTab?.map(item => (
          <Pressable
            key={item.id}
            style={[
              styleHeader.boxItem,
              tabActive === item.id ? styleHeader.boxItemActive : styleHeader.boxItemNotActive
            ]}
            onPress={() => onChangeTab(item.id)}>
            <Icon
              name="documents-outline"
              type={IconType.IONICON}
              size={18}
              color={tabActive === item.id ? 'white' : 'black'}
            />
            <Text
              style={{
                color: tabActive === item.id ? 'white' : 'black',
                fontWeight: 500
              }}>
              {item.text}
            </Text>
          </Pressable>
        ))}

        <View style={[styleHeader.boxItem, styleHeader.boxAdd]}>
          <Pressable onPress={createNewInvoice}>
            <Icon name="add" size={20} />
            <Text style={{ fontWeight: 500 }}>Tạo đơn mới</Text>
          </Pressable>
        </View>
      </View>
      {lstHoaDon?.length === 0 ? (
        <PageEmpty txt="Không có hóa đơn tạm" />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white'
          }}>
          <Input
            leftIcon={{ type: 'ionicon', name: 'search' }}
            placeholder="Tìm hóa đơn"
            containerStyle={{
              backgroundColor: 'white',
              borderRadius: 4,
              borderColor: '#F5F5F5'
            }}
            inputStyle={{ fontSize: 14 }}
          />
          {lstHoaDon?.length > 0 && (
            <ScrollView>
              {lstHoaDon?.map(item => (
                <Pressable style={stylesInvoiceItem.container} key={item?.id} onPress={() => goInvoiceDetail(item)}>
                  <View
                    style={{
                      flex: 1,
                      gap: 15,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                    <Icon
                      type="materialicon"
                      name="delete-outline"
                      size={24}
                      color={'#ff944d'}
                      style={{ flex: 1 }}
                      onPress={() => removeInvoice(item?.id)}
                    />
                    <View style={stylesInvoiceItem.boxCenter}>
                      <View style={{ flex: 2 }}>
                        <Text style={{ fontWeight: 500, color: theme.colors.primary }}>{item?.maHoaDon}</Text>
                        <Text style={{ color: 'rgb(178, 183, 187)', fontSize: 14 }}>
                          {format(new Date(item.ngayLapHoaDon), 'HH:mm')}
                        </Text>
                      </View>
                      <View style={{ flex: 3 }}>
                        <Text style={{ fontWeight: 500, textAlign: 'right', color: theme.colors.primary }}>
                          {new Intl.NumberFormat('vi-VN').format(item?.tongThanhToan ?? 0)}
                        </Text>
                        <Text
                          ellipsizeMode="tail"
                          numberOfLines={1}
                          style={{
                            textAlign: 'right',
                            color: 'rgb(178, 183, 187)'
                          }}>
                          {item?.tenKhachHang}
                        </Text>
                      </View>
                    </View>

                    <Icon type="antdesign" name="edit" size={24} style={{ flex: 1 }} onPress={() => gotoEdit(item)} />
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};
export default TempInvoices;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'rgb(245, 247, 244)',
    padding: 8
  }
});
const stylesInvoiceItem = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  boxCenter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 5
  }
});
