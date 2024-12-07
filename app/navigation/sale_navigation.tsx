import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon, Text} from '@rneui/base';
import {Pressable, StyleSheet, View} from 'react-native';
import {IconType} from '../enum/IconType';
import TempInvoices from '../screens/sale/temp_invoices';
import Products from '../screens/sale/products';
import {ListBottomTab} from '../enum/ListBottomTab';

export type BottomTabParamList = {
  TempInvoice: {idHoaDon: string; maHoaDon: string};
  TempInvoiceDetails: {
    idHoaDon: string;
    maHoaDon: string;
    tongThanhToan?: number;
  };
  Product: {idHoaDon: string; maHoaDon: string; tongThanhToan?: number};
};

type PropsSaleNavigatonHeader = {
  //   onPress: (typeAction: number) => void;
  navigation: any;
};

const SaleNavigatonHeader = ({navigation}: PropsSaleNavigatonHeader) => {
  const onClickActionHeader = (actionId: number) => {
    navigation.navigate(ListBottomTab.TEMP_INVOICE, {
      headerActionId: actionId,
    });
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        backgroundColor: '#FFF2CC',
      }}>
      <View style={[styleHeader.boxItem, styleHeader.boxItemActive]}>
        <Icon
          name="documents-outline"
          type={IconType.IONICON}
          size={18}
          color={'white'}
        />
        <Text style={{color: 'white', fontWeight: 500}}>Hóa đơn</Text>
      </View>
      <View style={[styleHeader.boxItem, styleHeader.boxItemNotActive]}>
        <Icon name="documents-outline" type="ionicon" size={18} />
        <Text style={{color: 'black', fontWeight: 500}}>Gói dịch vụ</Text>
      </View>
      <View style={[styleHeader.boxItem, styleHeader.boxAdd]}>
        <Pressable onPress={() => onClickActionHeader(0)}>
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
      initialRouteName="TempInvoice"
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
        name="TempInvoice"
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
        name="Product"
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
