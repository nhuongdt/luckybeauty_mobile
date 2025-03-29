import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SaleManagerStackParamList, SaleManagerTabParamList } from "./route_param_list";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SaleManagerTab, SaleManagerStack } from "./list_name_route";
import TempInvoices from "../screens/sale/temp_invoices";
import ProductSale from "../screens/sale/products";
import { TempInvoiceDetails } from "../screens/sale/teamp_invoice_details";
import ThanhToan from "../screens/sale/thanh_toan";
import { Icon } from "@rneui/base";
import { IconType } from "../enum/IconType";


function SaleManagerTabNavigation() {
    const Tabs = createBottomTabNavigator<SaleManagerTabParamList>();
    return <Tabs.Navigator
        screenOptions={{
            tabBarActiveTintColor: 'red',
            tabBarInactiveTintColor: 'gray',
            headerStyle: {
                backgroundColor: '#FFF4E5'
            },
            headerTitleAlign: 'center',
            headerTitleStyle: {
                // color: 'black',
                fontWeight: 400,
                fontSize: 16,
                textAlign: 'center'
            },
            headerTintColor: 'white',// màu của nút back và màu của tiêu đề
            tabBarLabelStyle: {
                fontSize: 14
            }
        }}>
        <Tabs.Screen name={SaleManagerTab.TEMP_INVOICE} component={TempInvoices}
            options={({ route, navigation }: any) => ({
                tabBarLabel: 'Hóa đơn tạm',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <Icon type={IconType.IONICON} name={focused ? 'book-outline' : 'book'} color={color} size={24} />
                )
            })} />
        <Tabs.Screen name={SaleManagerTab.PRODUCT} component={ProductSale}
            options={() => ({
                title: `Lựa chọn hàng bán`,
                tabBarLabel: 'Sản phẩm',
                tabBarIcon: ({ focused, color }) => (
                    <Icon type={IconType.IONICON} name={focused ? 'list' : 'list-sharp'} color={color} size={24} />
                ),
            })} />
    </Tabs.Navigator>
}

export function SaleManagerStackNavigation() {
    const Stack = createNativeStackNavigator<SaleManagerStackParamList>();
    return <Stack.Navigator
        screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#FFF2CC'
            }
        }}>
        <Stack.Screen name={SaleManagerStack.SALE_MANAGER_TAB} component={SaleManagerTabNavigation}
            options={() => ({
                headerShown: false,
            })} />
        <Stack.Screen name={SaleManagerStack.TEMP_INVOICE_DETAIL} component={TempInvoiceDetails}
            options={({ navigation, route }: any) => ({
                title: ` ${route?.param?.maHoaDon}`,
            })} />
        <Stack.Screen name={SaleManagerStack.THANH_TOAN} component={ThanhToan}
            options={{
                title: 'Thanh toán',
            }} />
    </Stack.Navigator>
}