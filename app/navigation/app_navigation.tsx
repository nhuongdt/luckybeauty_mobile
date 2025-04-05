import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PageNotFound from '../screens/+page_not_found';
import LoginScreen from '../screens/login';
import { useState } from 'react';
import { RootStackParamList } from './route_param_list';
import { ListRouteApp } from './list_name_route';
import { MainDrawerNavigation } from './main_drawer_navigation';
import { useAuthApp } from '../store/react_context/AuthProvider';

export default function AppNavigation() {
  const { isLogin } = useAuthApp();
  const [isLoadingForm, setIsLoadingForm] = useState(true);

  if (isLogin == null) return null; // Hiển thị màn hình loading nếu chưa check xong

  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator>
      {/* {!isLogin ? (
        <Stack.Screen
          name={ListRouteApp.LOGIN}
          component={LoginScreen}
          options={{
            headerShown: false
          }}
        />
      ) : ( */}
      <>
        <Stack.Screen
          name={ListRouteApp.MAIN_NAVIGATION}
          component={MainDrawerNavigation}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name={ListRouteApp.PAGE_NOT_FOUND}
          component={PageNotFound}
          options={{
            title: 'Page not found'
          }}
        />
      </>
      {/* )} */}
    </Stack.Navigator>
  );
}
