import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainDrawerParamList, SaleManagerStackParamList, SaleManagerTabParamList } from './route_param_list';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SaleManagerTab, SaleManagerStack, MainNavigation } from './list_name_route';
import TempInvoices from '../screens/sale/temp_invoices';
import ProductSale from '../screens/sale/products';
import { TempInvoiceDetails } from '../screens/sale/teamp_invoice_details';
import ThanhToan from '../screens/sale/thanh_toan';
import { Badge, Icon } from '@rneui/base';
import { IconType } from '../enum/IconType';
import { TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import realmQuery from '../store/realm/realmQuery';
import { SaleManagerStackProvider, useSaleManagerStackContext } from '../store/react_context/SaleManagerStackProvide';
import { Image, useTheme } from '@rneui/themed';
import { CustomerTabBar } from './customer_tab_bar';

type SaleManagerTabNavigationProps = DrawerNavigationProp<MainDrawerParamList, MainNavigation.SALE_MANAGER_STACK>;

function SaleManagerTabNavigation() {
  const Tabs = createBottomTabNavigator<SaleManagerTabParamList>();
  const navigation = useNavigation<SaleManagerTabNavigationProps>();
  const { currentInvoice } = useSaleManagerStackContext();
  const idHoaDon = currentInvoice?.idHoaDon ?? '';
  const countProduct = currentInvoice?.countProduct ?? 0;

  const { theme } = useTheme();

  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.greyOutline,
        headerStyle: {
          backgroundColor: theme.colors.white
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: theme.colors.black,
          fontWeight: 400,
          fontSize: 16,
          textAlign: 'center'
        },
        headerTintColor: theme.colors.white, // màu của nút back và màu của tiêu đề
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 500
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon
              name="menu"
              size={24}
              style={{
                paddingLeft: 16
              }}
            />
          </TouchableOpacity>
        )
      }}
      tabBar={props => <CustomerTabBar {...props} />}>
      <Tabs.Screen
        name={SaleManagerTab.TEMP_INVOICE}
        component={TempInvoices}
        options={({ route, navigation }: any) => ({
          tabBarLabel: 'Hóa đơn tạm',
          title: 'Hóa đơn tạm',
          tabBarIcon: ({ color, focused }) => (
            <Icon type={IconType.IONICON} name={focused ? 'book-outline' : 'book'} color={color} size={24} />
          )
        })}
      />
      <Tabs.Screen
        name={SaleManagerTab.PRODUCT}
        component={ProductSale}
        options={({ navigation, route }) => ({
          title: `Lựa chọn hàng bán`,
          tabBarLabel: 'Sản phẩm',
          tabBarIcon: ({ focused, color }) => (
            <Icon type={IconType.IONICON} name={focused ? 'list' : 'list-sharp'} color={color} size={24} />
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{
                padding: 16,
                position: 'relative'
              }}
              onPress={() => {
                (navigation as unknown as NativeStackNavigationProp<SaleManagerStackParamList>).navigate(
                  SaleManagerStack.TEMP_INVOICE_DETAIL
                );
              }}>
              {(countProduct ?? 0) > 0 && (
                <Badge
                  value={countProduct}
                  status="primary"
                  containerStyle={{
                    position: 'absolute',
                    top: 10
                  }}
                />
              )}
              <Icon name="shopping-basket" type={IconType.FONT_AWESOME_5} color={theme.colors.primary} />
            </TouchableOpacity>
          )
        })}
      />
    </Tabs.Navigator>
  );
}

export function SaleManagerStackNavigation() {
  const Stacks = createNativeStackNavigator<SaleManagerStackParamList>();
  const { theme } = useTheme();
  return (
    <SaleManagerStackProvider>
      <Stacks.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: theme.colors.white
          }
        }}>
        <Stacks.Screen
          name={SaleManagerStack.SALE_MANAGER_TAB}
          component={SaleManagerTabNavigation}
          options={() => ({
            headerShown: false
          })}
        />
        <Stacks.Screen
          name={SaleManagerStack.TEMP_INVOICE_DETAIL}
          component={TempInvoiceDetails}
          options={({ navigation, route }: any) => ({
            title: ` ${route?.param?.maHoaDon}`
          })}
        />
        <Stacks.Screen
          name={SaleManagerStack.THANH_TOAN}
          component={ThanhToan}
          options={{
            title: 'Thanh toán'
          }}
        />
      </Stacks.Navigator>
    </SaleManagerStackProvider>
  );
}
