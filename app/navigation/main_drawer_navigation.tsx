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
import { Avatar, Image, Text, useTheme } from '@rneui/themed';

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
  const { userLogin } = useAuthApp();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        drawerActiveTintColor: theme.colors.primary,
        drawerActiveBackgroundColor: theme.colors.grey5,
        headerStyle: {
          backgroundColor: theme.colors.white
        },
        headerRight: () => <Avatar size={24} containerStyle={{ backgroundColor: theme.colors.primary }} />
      }}>
      <Drawer.Screen
        name={MainNavigation.DASH_BOARD}
        component={Dashboard}
        options={() => ({
          title: `Hello, ${userLogin}`,
          drawerIcon: ({ focused, color, size }) => (
            <Icon
              type={IconType.IONICON}
              name={'home'}
              color={focused ? theme.colors.primary : theme.colors.disabled}
            />
          )
          // headerLeft: () => <Text> Hello, {userLogin}</Text>
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
  },
  header: {
    backgroundColor: '#2089dc',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10
  },
  name: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});
