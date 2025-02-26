import { createDrawerNavigator } from '@react-navigation/drawer';
import { PageKhachHang } from '../screens/quan_ly/khach_hang/page_khach_hang';
import SaleNavigation from './sale_navigation';
import PageNotFound from '../screens/+page_not_found';

const Drawer = createDrawerNavigator();

export const RootNavigation = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Home" component={SaleNavigation} />
            <Drawer.Screen name="Customer" component={PageKhachHang} />
            <Drawer.Screen name='PageNotFound' component={PageNotFound} options={{ headerShown: false }} />
        </Drawer.Navigator>
    );
}
