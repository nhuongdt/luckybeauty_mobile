import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { PageKhachHang } from '../screens/quan_ly/khach_hang/page_khach_hang';
import PageNotFound from '../screens/+page_not_found';
import { Dashboard } from '../screens/dashboard';
import { MainNavigation } from './list_name_route';
import { SaleManagerStackNavigation } from './sale_manager_stack_navigation';
import { StyleSheet, View } from 'react-native';
import { Icon } from '@rneui/base';
import { IconType } from '../enum/IconType';
import LoginScreen from '../screens/login';
import { useContext } from 'react';
import { useAuthApp } from '../store/react_context/AuthProvider';
import { Image, Text, useTheme } from '@rneui/themed';

const Drawer = createDrawerNavigator();

const CustomDrawer = (props: any) => {
  const navigation = props.navigation;
  const { logout } = useAuthApp();
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1
      }}>
      <View style={{ padding: 16, flexDirection: 'row', alignItems: 'flex-end' }}>
        <Image
          style={{
            resizeMode: 'stretch',
            width: 30,
            height: 30
          }}
          source={require('./../assets/images/app-logo.png')}
        />
        <Text style={{ marginLeft: 12, fontSize: 18, fontWeight: 600, color: 'rgb(49, 157, 255)' }}>Lucky Beauty</Text>
      </View>
      <DrawerItemList {...props} />
      <View style={{ flex: 1 }} />
      <DrawerItem
        label={'Logout'}
        style={styles.logoutItem}
        onPress={logout}
        icon={() => <Icon type={IconType.ANTDESIGN} name="logout" size={24} />}
      />
    </DrawerContentScrollView>
  );
};

export const MainDrawerNavigation = () => {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        drawerActiveTintColor: theme.colors.primary,
        drawerActiveBackgroundColor: theme.colors.grey5
      }}>
      <Drawer.Screen
        name={MainNavigation.DASH_BOARD}
        component={Dashboard}
        options={() => ({
          title: 'Trang chủ',
          drawerIcon: ({ focused, color, size }) => (
            <Icon
              type={IconType.IONICON}
              name={'home'}
              color={focused ? theme.colors.primary : theme.colors.disabled}
            />
          )
        })}
      />
      <Drawer.Screen
        name={MainNavigation.SALE_MANAGER_STACK}
        component={SaleManagerStackNavigation}
        options={() => ({
          title: 'Thu ngân',
          headerShown: false,
          drawerIcon: ({ focused, color, size }) => (
            <Icon
              type={IconType.FOUNDATION}
              name={'burst-sale'}
              color={focused ? theme.colors.primary : theme.colors.disabled}
            />
          )
        })}
      />
      <Drawer.Screen
        name={MainNavigation.CUSTOMER}
        component={PageKhachHang}
        options={() => ({
          title: 'Quản lý khách hàng',
          headerShown: false,
          drawerIcon: ({ focused, color, size }) => (
            <Icon
              type={IconType.FONT_AWESOME_5}
              name={'user-friends'}
              color={focused ? theme.colors.primary : theme.colors.disabled}
            />
          )
        })}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  logoutItem: {
    marginBottom: 16
  }
});
