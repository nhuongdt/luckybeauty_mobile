import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { PageKhachHang } from '../screens/quan_ly/khach_hang/page_khach_hang';
import SaleNavigation from './sale_navigation';
import PageNotFound from '../screens/+page_not_found';
import { Dashboard } from '../screens/dashboard';
import { MainNavigation } from './list_name_route';
import { SaleManagerStackNavigation } from './sale_manager_stack_navigation';
import { StyleSheet, View } from 'react-native';
import { Icon } from '@rneui/base';
import { IconType } from '../enum/IconType';

const Drawer = createDrawerNavigator();

const CustomDrawer = (props: any) => {
    const navigation = props.navigation;
    return <DrawerContentScrollView {...props}>
        <DrawerItemList  {...props} />

        <DrawerItem label={'Logout'} style={styles.logoutItem} onPress={() => { }} />
    </DrawerContentScrollView>
}

export const MainDrawerNavigation = () => {
    return (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />} screenOptions={{
            drawerActiveTintColor: 'red',
            drawerActiveBackgroundColor: '#FFF4E5'
        }}>
            <Drawer.Screen name={MainNavigation.DASH_BOARD} component={Dashboard}
                options={() => ({
                    title: 'Trang chủ',
                    drawerIcon: ({ focused, color, size }) => (
                        <Icon type={IconType.IONICON} name={'home'} />
                    )
                })} />
            <Drawer.Screen name={MainNavigation.SALE_MANAGER_STACK} component={SaleManagerStackNavigation} options={() => ({
                title: 'Quản lý bán hàng',
                headerShown: false
            })} />
            <Drawer.Screen name={MainNavigation.CUSTOMER} component={PageKhachHang} options={() => ({
                title: 'Quản lý khách hàng'
            })} />
        </Drawer.Navigator>
    );
}


const styles = StyleSheet.create({
    logoutItem: {
        position: 'absolute',
        bottom: 16
    }
})

