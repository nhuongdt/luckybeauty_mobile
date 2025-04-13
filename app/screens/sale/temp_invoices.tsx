import { View, StyleSheet, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { Icon, Button, Text, useTheme } from '@rneui/themed';
import { useEffect, useRef, useContext, useState, useCallback } from 'react';
import uuid from 'react-native-uuid';
import { format } from 'date-fns';
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input, Theme } from '@rneui/base';
import realmQuery from '../../store/realm/realmQuery';
import { HoaDonDto, IHoaDonDto } from '../../services/hoadon/dto';
import { LoaiChungTu, TenLoaiChungTu } from '../../enum/LoaiChungTu';
import CommonFunc from '../../utils/CommonFunc';
import { IconType } from '../../enum/IconType';
import PageEmpty from '../../components/page_empty';
import { ActionType } from '../../enum/ActionType';
import { SaleManagerStack, SaleManagerTab } from '../../navigation/list_name_route';
import { SaleManagerStackParamList, SaleManagerTabParamList } from '../../navigation/route_param_list';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useSaleManagerStackContext } from '../../store/react_context/SaleManagerStackProvide';

// type TempInvoicekNavigationProps = NativeStackNavigationProp<SaleManagerTabParamList>;
type TempInvoicekNavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<SaleManagerTabParamList, SaleManagerTab.TEMP_INVOICE>,
  NativeStackNavigationProp<SaleManagerStackParamList>
>;

type TempInvoiceRouteProp = RouteProp<SaleManagerTabParamList, SaleManagerTab.TEMP_INVOICE>;

const TempInvoices = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const firstLoad = useRef(true);
  const navigation = useNavigation<TempInvoicekNavigationProps>();
  const route = useRoute<TempInvoiceRouteProp>();
  const { currentInvoice, setCurrentInvoice } = useSaleManagerStackContext();

  const [lstHoaDon, setLstHoaDon] = useState<IHoaDonDto[]>([]);
  const [tabActive, setTabActive] = useState(LoaiChungTu.HOA_DON_BAN_LE);

  const arrTab = [
    {
      id: LoaiChungTu.HOA_DON_BAN_LE,
      text: 'Hóa đơn'
    },
    {
      id: LoaiChungTu.GOI_DICH_VU,
      text: 'Gói dịch vụ'
    }
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

    setCurrentInvoice({
      ...currentInvoice,
      idHoaDon: newHD?.id,
      countProduct: 0,
      idLoaiChungTu: tabActive
    });
    navigation.navigate(SaleManagerTab.PRODUCT);
  };

  const onChangeTab = (tabActive: number) => {
    getHoaDonFromCache(tabActive);
    setTabActive(tabActive);
    setCurrentInvoice({
      ...currentInvoice,
      idLoaiChungTu: tabActive
    });
  };

  const removeInvoice = async (id: string) => {
    realmQuery.RemoveHoaDon_byId(id);
    realmQuery.DeleteHoaDonChiTiet_byIdHoaDon(id);
    setLstHoaDon(lstHoaDon?.filter(x => x.id !== id));
  };

  const goInvoiceDetail = (item: IHoaDonDto) => {
    setCurrentInvoice({
      ...currentInvoice,
      idHoaDon: item.id
    });
    navigation.navigate(SaleManagerStack.TEMP_INVOICE_DETAIL);
  };

  const gotoEdit = (item: IHoaDonDto) => {
    const lstCTHD = realmQuery.GetListChiTietHoaDon_byIdHoaDon(item.id);
    setCurrentInvoice({
      ...currentInvoice,
      idHoaDon: item.id,
      countProduct: lstCTHD?.length ?? 0
    });
    navigation.navigate(SaleManagerTab.PRODUCT);
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
      navigation.navigate(SaleManagerTab.PRODUCT);
      //setIdHoaDon(hdAfter?.id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {arrTab?.map(item => (
          <Pressable
            key={item.id}
            style={[styles.tabItem, tabActive === item.id ? styles.tabItemActive : styles.tabItemInActive]}
            onPress={() => onChangeTab(item.id)}>
            <Icon
              name="documents-outline"
              type={IconType.IONICON}
              size={18}
              color={tabActive === item.id ? theme.colors.white : theme.colors.black}
            />
            <Text
              style={{
                color: tabActive === item.id ? theme.colors.white : theme.colors.black,
                fontWeight: 500
              }}>
              {item.text}
            </Text>
          </Pressable>
        ))}

        <View style={[styles.tabItem, styles.tabItemAdd]}>
          <Pressable onPress={createNewInvoice}>
            <Icon name="add" size={20} />
            <Text
              style={{
                fontWeight: 500
              }}>
              Tạo đơn mới
            </Text>
          </Pressable>
        </View>
      </View>
      {lstHoaDon?.length === 0 ? (
        <PageEmpty txt={`Không có ${tabActive === LoaiChungTu.HOA_DON_BAN_LE ? 'hóa đơn tạm' : 'gói dịch vụ tạm'}`} />
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.white
          }}>
          <Input
            leftIcon={{
              type: 'ionicon',
              name: 'search'
            }}
            placeholder="Tìm hóa đơn"
            containerStyle={styles.inputContainer}
            inputStyle={{
              fontSize: 14
            }}
          />
          {lstHoaDon?.length > 0 && (
            <ScrollView>
              {lstHoaDon?.map(item => (
                <Pressable style={styles.itemInvoice} key={item?.id} onPress={() => goInvoiceDetail(item)}>
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
                      color={theme.colors.error}
                      style={{
                        flex: 1
                      }}
                      onPress={() => removeInvoice(item?.id)}
                    />
                    <View style={styles.contentInvoice}>
                      <View
                        style={{
                          flex: 2
                        }}>
                        <Text
                          style={{
                            fontWeight: 500,
                            color: theme.colors.primary
                          }}>
                          {item?.maHoaDon}
                        </Text>
                        <Text
                          style={{
                            color: theme.colors.greyOutline,
                            fontSize: 14
                          }}>
                          {format(new Date(item.ngayLapHoaDon), 'HH:mm')}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 3
                        }}>
                        <Text
                          style={{
                            fontWeight: 500,
                            textAlign: 'right',
                            color: theme.colors.primary
                          }}>
                          {new Intl.NumberFormat('vi-VN').format(item?.tongThanhToan ?? 0)}
                        </Text>
                        <Text
                          ellipsizeMode="tail"
                          numberOfLines={1}
                          style={{
                            textAlign: 'right',
                            color: theme.colors.greyOutline
                          }}>
                          {item?.tenKhachHang}
                        </Text>
                      </View>
                    </View>

                    <Icon
                      type="antdesign"
                      name="edit"
                      size={24}
                      style={{
                        flex: 1
                      }}
                      onPress={() => gotoEdit(item)}
                    />
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      )}
      <TouchableOpacity style={{ position: 'absolute', bottom: 80, right: 20 }} onPress={createNewInvoice}>
        <Icon type={IconType.IONICON} name="add-circle-outline" color={theme.colors.primary} size={50}></Icon>
      </TouchableOpacity>
    </View>
  );
};
export default TempInvoices;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.white,
      padding: 8,
      position: 'relative'
    },
    tabsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 8,
      backgroundColor: theme.colors.grey5
    },
    tabItem: {
      gap: 8,
      minWidth: 120,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center'
    },
    tabItemActive: {
      backgroundColor: theme.colors.primary
    },
    tabItemInActive: {
      backgroundColor: theme.colors.disabled
    },
    tabItemAdd: {
      backgroundColor: theme.colors.white
    },
    itemInvoice: {
      backgroundColor: theme.colors.white,
      padding: 10,
      borderBottomColor: theme.colors.greyOutline,
      borderBottomWidth: 1
    },
    contentInvoice: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 5
    },
    inputContainer: {
      backgroundColor: theme.colors.white,
      borderRadius: 4,
      borderColor: theme.colors.greyOutline
    }
  });
