import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SaleNavigation from './sale_navigation';
import PageNotFound from '../screens/+page_not_found';
import LoginScreen from '../screens/login';
import { mmkvStorage } from '../store/mmkvStore';
import LoginService from '../services/login/LoginService';
import { useEffect, useState } from 'react';

export type StackParamList = {
  SaleNavigation: undefined;
  PageNotFound: undefined;
};

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
      console.log('dataUser ',dataUser)
      if (dataUser != null) {
        const token = await LoginService.checkUserLogin(
          dataUser,
          dataUser.tenantId ?? 0
        );

        if (token != null) {
          setIsLogin(true);

          mmkvStorage.set("accessToken", token.accessToken);
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


  if (!isLogin) return <LoginScreen onLoginOK={() => setIsLogin(true)} />;

  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName='SaleNavigation'>
      <Stack.Screen
        name="SaleNavigation"
        component={SaleNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PageNotFound"
        component={PageNotFound}
        options={{title: 'Page not found'}}
      />
    </Stack.Navigator>
  );
}
