import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon, Text} from '@rneui/base';
import {Pressable, StyleSheet, View} from 'react-native';
import {IconType} from '../enum/IconType';
import TempInvoices from '../screens/sale/temp_invoices';
import Products from '../screens/sale/products';
import {ListBottomTab} from '../enum/ListBottomTab';
import uuid from 'react-native-uuid';
import realmQuery from '../store/realm/realmQuery';
import CommonFunc from '../utils/CommonFunc';
import {KiHieuChungTu, TenLoaiChungTu} from '../enum/LoaiChungTu';
import {HoaDonDto} from '../services/hoadon/dto';
import realmDatabase from '../store/realm/database';
import {useState} from 'react';

export type BottomTabParamList = {
  TempInvoice: {idHoaDon: string; maHoaDon: string};
  TempInvoiceDetails: {
    idHoaDon: string;
    maHoaDon: string;
    tongThanhToan?: number;
  };
  Product: {idHoaDon: string; maHoaDon: string; tongThanhToan?: number};
};

export enum SaleHeader_ListTab {
  HOA_DON = 1,
  GOI_DICH_VU = 2,
  CREATE_NEW = 0,
}

type PropsSaleNavigatonHeader = {
  //   onPress: (typeAction: number) => void;
  navigation: any;
};

const SaleNavigatonHeader = ({navigation}: PropsSaleNavigatonHeader) => {
  const db = realmDatabase;
  const [tabActive, setTabActive] = useState(SaleHeader_ListTab.HOA_DON);

  const arrTab = [
    {id: SaleHeader_ListTab.HOA_DON, text: 'Hóa đơn'},
    {id: SaleHeader_ListTab.GOI_DICH_VU, text: 'Gói dịch vụ'},
  ];

  const createNewInvoice = () => {
    const newId = uuid.v4().toString();
    // gan lai giatri cot isOpenLastest = false cho all hoadon
    realmQuery.HoaDon_ResetValueForColumn_isOpenLastest(tabActive);

    const lstHoaDon = realmQuery.GetListHoaDon_ByLoaiChungTu(tabActive);

    const max = CommonFunc.getMaxNumberFromMaHoaDon(lstHoaDon);
    const kiHieuMaChungTu =
      tabActive == SaleHeader_ListTab.HOA_DON
        ? TenLoaiChungTu.HOA_DON_BAN_LE
        : TenLoaiChungTu.GOI_DICH_VU;

    const newHD = new HoaDonDto({
      id: newId,
      maHoaDon: `${kiHieuMaChungTu} ${max}`,
    });
    realmQuery.InsertTo_HoaDon(db, newHD);

    navigation.navigate(ListBottomTab.PRODUCT, {
      idHoaDon: newId,
      maHoaDon: newHD.maHoaDon,
      tongThanhToan: 0,
    });
  };

  const onClickActionHeader = (actionId: number) => {
    switch (actionId) {
      case SaleHeader_ListTab.CREATE_NEW:
        {
          createNewInvoice();
        }
        break;
      case SaleHeader_ListTab.HOA_DON:
      case SaleHeader_ListTab.GOI_DICH_VU:
        {
          navigation.navigate(ListBottomTab.TEMP_INVOICE, {
            headerActionId: actionId,
          });
          setTabActive(actionId);
        }
        break;
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        backgroundColor: '#FFF2CC',
      }}>
      {arrTab?.map(item => (
        <Pressable
          style={[
            styleHeader.boxItem,
            tabActive === item.id
              ? styleHeader.boxItemActive
              : styleHeader.boxItemNotActive,
          ]}
          onPress={() => onClickActionHeader(item.id)}>
          <Icon
            name="documents-outline"
            type={IconType.IONICON}
            size={18}
            color={tabActive === item.id ? 'white' : 'black'}
          />
          <Text
            style={{
              color: tabActive === item.id ? 'white' : 'black',
              fontWeight: 500,
            }}>
            {item.text}
          </Text>
        </Pressable>
      ))}

      <View style={[styleHeader.boxItem, styleHeader.boxAdd]}>
        <Pressable
          onPress={() => onClickActionHeader(SaleHeader_ListTab.CREATE_NEW)}>
          <Icon name="add" size={20} />
          <Text style={{fontWeight: 500}}>Tạo đơn mới</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styleHeader = StyleSheet.create({
  boxItem: {
    gap: 8,
    minWidth: 120,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  boxItemActive: {
    backgroundColor: '#FA6800',
  },
  boxItemNotActive: {
    backgroundColor: '#F5F5F5',
  },
  boxAdd: {
    backgroundColor: 'white',
  },
});

export default function SaleNavigation() {
  const Tabs = createBottomTabNavigator<BottomTabParamList>();

  return (
    <Tabs.Navigator
      initialRouteName={ListBottomTab.TEMP_INVOICE}
      screenOptions={{
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#FFF4E5',
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: 'black',
          fontWeight: 400,
          fontSize: 16,
          textAlign: 'center',
        },
        headerTintColor: 'white',
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: '#FFF4E5',
        },
        tabBarLabelStyle: {
          fontSize: 14,
        },
      }}>
      <Tabs.Screen
        name={ListBottomTab.TEMP_INVOICE}
        component={TempInvoices}
        options={({navigation, route}: any) => ({
          title: 'Hóa đơn tạm',
          headerTitleStyle: {display: 'none'},
          tabBarIcon: ({color, focused}) => (
            <Icon
              type={IconType.IONICON}
              name={focused ? 'home-sharp' : 'home-outline'}
              color={color}
              size={24}
            />
          ),
          header: () => <SaleNavigatonHeader navigation={navigation} />,
        })}
      />
      <Tabs.Screen
        name={ListBottomTab.PRODUCT}
        component={Products}
        options={({navigation, route}: any) => ({
          title: `${route.params?.maHoaDon} _ ${new Intl.NumberFormat(
            'vi-VN',
          ).format(route.params?.tongThanhToan)}`,
          tabBarLabel: 'Sản phẩm',
          tabBarIcon: ({focused, color}) => (
            <Icon
              name={focused ? 'event-note' : 'note'}
              color={color}
              size={24}
            />
          ),
          headerLeft: () => (
            <Pressable
              style={{padding: 16}}
              onPress={() => {
                navigation.navigate(ListBottomTab.TEMP_INVOICE, {
                  tongThanhToan: route.params?.tongThanhToan,
                });
              }}>
              <Icon name="arrow-back-ios" type="material" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              style={{padding: 16}}
              onPress={() => {
                navigation.navigate(ListBottomTab.TEMP_INVOICE_DETAIL, {
                  idHoaDon: route.params?.idHoaDon,
                  maHoaDon: route.params?.maHoaDon,
                  tongThanhToan: route.params?.tongThanhToan,
                });
              }}>
              <Icon name="arrow-forward-ios" type="material" />
            </Pressable>
          ),
        })}
      />
      {/* <Tabs.Screen
        name="TempInvoiceDetails"
        component={TempInvoiceDetails}
        options={({navigation, route}: any) => ({
          title: `${route.params?.maHoaDon}`,
          tabBarButton: () => null,
          tabBarStyle: {display: 'none'}, // ẩn tabbar
          headerLeft: () => (
            <Pressable
              style={{padding: 16}}
              onPress={() => {
                navigation.navigate(ListBottomTab.PRODUCT, {
                  idHoaDon: route.params?.idHoaDon,
                  maHoaDon: route.params?.maHoaDon,
                  tongThanhToan: route.params?.tongThanhToan,
                });
              }}>
              <Icon name="arrow-back-ios" type="material" />
            </Pressable>
          ),
        })}
      /> */}
    </Tabs.Navigator>
  );
}
