import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PageNotFound from '../screens/+page_not_found';
import LoginScreen from '../screens/login';
import { mmkvStorage } from '../store/mmkvStore';
import LoginService from '../services/login/LoginService';
import { useEffect, useState } from 'react';
import { TempInvoiceDetails } from '../screens/sale/teamp_invoice_details';
import { Pressable } from 'react-native';
import { Icon, Text } from '@rneui/base';
import { IconType } from '../enum/IconType';
import Customer from '../screens/customers/customers';
import ThanhToan from '../screens/sale/thanh_toan';
import React from 'react';
import { RootStackParamList } from './route_param_list';
import { ListRouteApp } from './list_name_route';
import { IUserLoginDto } from '../services/login/LoginDto';
import { UserLoginContext } from '../store/react_context/UserLogin';
import ChiNhanhService from '../services/chi_nhanh/ChiNhanhService';
import { MainDrawerNavigation } from './main_drawer_navigation';

export default function AppNavigation() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(true);

  const [userLogin, setUserLogin] = useState<IUserLoginDto>({ userName: '', idChiNhanh: '' });

  useEffect(() => {
    CheckUser_HasLogin();
  }, []);

  const CheckUser_HasLogin = async () => {
    try {
      // await SecureStore.deleteItemAsync("user");
      const dataUser = LoginService.checkUser_fromCache();
      if (dataUser != null) {
        const token = await LoginService.checkUserLogin(dataUser, dataUser.tenantId ?? 0);

        if (token != null) {
          setIsLogin(true);
          mmkvStorage.set('accessToken', token.accessToken);

          const chiNhanhOfUser = await ChiNhanhService.GetChiNhanhByUser();
          if (chiNhanhOfUser?.length > 0) {
            const user = mmkvStorage.getString("user");
            if (user) {
              const dataUser = JSON.parse(user);
              setUserLogin({
                ...userLogin,
                userName: dataUser.userNameOrEmailAddress,
                idChiNhanh: chiNhanhOfUser[0].id ?? ''
              })
            }
          }

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

  const onLoginOK = (user: IUserLoginDto) => {
    setIsLogin(true);
    setUserLogin({
      ...userLogin,
      userName: user.userName,
      idChiNhanh: user.idChiNhanh
    })
  }

  if (!isLogin) return <LoginScreen onLoginOK={onLoginOK} />;

  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <UserLoginContext.Provider value={userLogin}>
      <Stack.Navigator>
        <Stack.Screen name={ListRouteApp.MAIN_NAVIGATION} component={MainDrawerNavigation} options={{ headerShown: false }} />
        <Stack.Screen name={ListRouteApp.PAGE_NOT_FOUND} component={PageNotFound} options={{ title: 'Page not found' }} />
      </Stack.Navigator>
    </UserLoginContext.Provider>

  );
}
