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
import {KiHieuChungTu, LoaiChungTu, TenLoaiChungTu} from '../enum/LoaiChungTu';
import {HoaDonDto} from '../services/hoadon/dto';
import realmDatabase from '../store/realm/database';
import {useState} from 'react';
import {TempInvoiceDetails} from '../screens/sale/teamp_invoice_details';
import {InvoiceStackParamList} from '../type/InvoiceStackParamList';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ListInvoiceStack} from '../enum/ListInvoiceStack';
import ThanhToan from '../screens/sale/thanh_toan';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {SaleBottomTabParamList} from '../type/SaleBottomTabParamList';
import {Badge} from '@rneui/themed';

const InvoiceStackNavigation = () => {
  const InvoiceStack = createNativeStackNavigator<InvoiceStackParamList>();
  return (
    <InvoiceStack.Navigator initialRouteName={ListInvoiceStack.TEMP_INVOICE}>
      <InvoiceStack.Screen
        name={ListInvoiceStack.TEMP_INVOICE}
        component={TempInvoices}
        options={{
          headerShown: false
        }}
      />

      {/* <InvoiceStack.Screen
        name={ListInvoiceStack.TEMP_INVOICE_DETAIL}
        component={TempInvoiceDetails}
        options={({navigation, route}: any) => ({
          title: ` ${route?.param?.maHoaDon}`,
          headerTitleAlign: 'center',
          presentation: 'fullScreenModal',
          headerStyle: {backgroundColor: '#FFF2CC'},
        })}
      /> */}
      <InvoiceStack.Screen
        name={ListInvoiceStack.TEMP_INVOICE_DETAIL}
        component={TempInvoiceDetails}
        options={({navigation, route}: any) => ({
          title: ` ${route?.param?.maHoaDon}`,
          headerTitleAlign: 'center',
          presentation: 'modal',
          headerStyle: {backgroundColor: '#FFF2CC'}
        })}
      />
      <InvoiceStack.Screen
        name={ListInvoiceStack.THANH_TOAN}
        component={ThanhToan}
        options={{
          title: 'Thanh toán',
          headerTitleAlign: 'center',
          presentation: 'card',
          headerStyle: {backgroundColor: '#FFF2CC'}
        }}
      />
    </InvoiceStack.Navigator>
  );
};

export default function SaleNavigation() {
  const Tabs = createBottomTabNavigator<SaleBottomTabParamList>();

  function getTabBarVisibility(route: any) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Invoices';
    if (routeName === ListInvoiceStack.TEMP_INVOICE_DETAIL || routeName === ListInvoiceStack.THANH_TOAN) {
      return 'none'; // Ẩn TabBar
    }
    return 'flex'; // Hiển thị TabBar
  }

  return (
    <Tabs.Navigator
      initialRouteName={ListBottomTab.INVOICE_STACK_NAVIGATION}
      screenOptions={({route}) => ({
        tabBarStyle: {
          display: getTabBarVisibility(route),
          backgroundColor: '#FFF4E5'
        },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#FFF4E5'
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: 'black',
          fontWeight: 400,
          fontSize: 16,
          textAlign: 'center'
        },
        headerTintColor: 'white',
        headerShadowVisible: false,
        tabBarLabelStyle: {
          fontSize: 14
        }
      })}>
      <Tabs.Screen
        name={ListBottomTab.INVOICE_STACK_NAVIGATION}
        component={InvoiceStackNavigation}
        options={({navigation, route}: any) => ({
          tabBarLabel: 'Hóa đơn tạm',
          headerShown: false,
          tabBarIcon: ({color, focused}) => (
            <Icon type={IconType.IONICON} name={focused ? 'book-outline' : 'book'} color={color} size={24} />
          )
        })}
      />
      <Tabs.Screen
        name={ListBottomTab.PRODUCT}
        component={Products}
        options={({navigation, route}: any) => ({
          title: `Lựa chọn hàng bán`,
          headerTitleAlign: 'center',
          tabBarLabel: 'Sản phẩm',
          tabBarIcon: ({focused, color}) => (
            <Icon type={IconType.IONICON} name={focused ? 'list' : 'list-sharp'} color={color} size={24} />
          ),
          headerRight: () => (
            <Pressable
              style={{padding: 16, position: 'relative'}}
              onPress={() => {
                navigation.navigate(ListBottomTab.INVOICE_STACK_NAVIGATION, {
                  screen: ListInvoiceStack.TEMP_INVOICE_DETAIL,
                  params: {idHoaDon: route.params?.idHoaDon}
                });
              }}>
              {(route.params?.countProduct ?? 0) > 0 && (
                <Badge
                  value={route.params?.countProduct}
                  status="warning"
                  containerStyle={{position: 'absolute', top: 10}}
                />
              )}

              <Icon name="shopping-basket" type={IconType.FONT_AWESOME_5} color={'blue'} />
            </Pressable>
          )
        })}
      />
    </Tabs.Navigator>
  );
}
