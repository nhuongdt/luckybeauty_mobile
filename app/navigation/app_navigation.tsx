import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SaleNavigation from './sale_navigation';
import PageNotFound from '../screens/+page_not_found';
import LoginScreen from '../screens/login';
import {mmkvStorage} from '../store/mmkvStore';
import LoginService from '../services/login/LoginService';
import {useEffect, useState} from 'react';
import {TempInvoiceDetails} from '../screens/sale/teamp_invoice_details';
import {Pressable} from 'react-native';
import {ListBottomTab} from '../enum/ListBottomTab';
import {Icon, Text} from '@rneui/base';
import {IconType} from '../enum/IconType';
import {ListRouteApp} from '../enum/ListRouteApp';
import Customer from '../screens/customers/customers';
import ThanhToan from '../screens/sale/thanh_toan';
import React from 'react';
import {RootStackParamList} from '../type/RootStackParamList';

export default function AppNavigation() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(true);

  useEffect(() => {
    CheckUser_HasLogin();
  }, []);

  const CheckUser_HasLogin = async () => {
    try {
      // await SecureStore.deleteItemAsync("user");
      const dataUser = LoginService.checkUser_fromCache();
      console.log('dataUser ', dataUser);
      if (dataUser != null) {
        const token = await LoginService.checkUserLogin(
          dataUser,
          dataUser.tenantId ?? 0,
        );

        if (token != null) {
          setIsLogin(true);

          mmkvStorage.set('accessToken', token.accessToken);
        } else {
          setIsLogin(false);
        }
      } else {
        setIsLogin(false);
      }
    } catch (error) {
      setIsLogin(false);
    }
    setIsLoadingForm(false);
  };

  // if (!isLogin) return <LoginScreen onLoginOK={() => setIsLogin(true)} />;

  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator>
      <>
        <Stack.Screen
          name={ListRouteApp.SALE_NAGIGATION}
          component={SaleNavigation}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name={ListRouteApp.PAGE_NOT_FOUND}
          component={PageNotFound}
          options={{title: 'Page not found'}}
        />
        <Stack.Screen
          name={ListRouteApp.CUSTOMER}
          component={Customer}
          options={{headerShown: false}}
        />
      </>
    </Stack.Navigator>
  );
}
