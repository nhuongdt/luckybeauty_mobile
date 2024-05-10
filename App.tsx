import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
// import { createDrawerNavigator } from '@react-navigation';
import { createDrawerNavigator } from "@react-navigation/drawer";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import dashboard from "./page/dashboard/dashboard";
import PageInvoice from "./page/invoice/PageInvoice";
import Login from "./page/login/login";
import * as Keychain from "react-native-keychain";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import loginService from "./api/login/loginService";
import PageThuNgan from "./page/thu_ngan/PageThuNgan";

// const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const CheckUser_HasLogin = async () => {
    try {
      // SecureStore.deleteItemAsync("user");
      const dataUser = await loginService.CheckUser_fromCache();
      if (dataUser != null) {
        const token = await loginService.CheckUser(
          dataUser,
          dataUser.tenantId ?? 0
        );
        if (token != null) {
          setIsLogin(true);
          SecureStore.setItem("accessToken", token.accessToken);
        } else {
          setIsLogin(false);
        }
      } else {
        setIsLogin(false);
      }
    } catch (error) {
      setIsLogin(false);
      Keychain.resetGenericPassword();
    }
  };
  const checkA = (value: boolean) => {
    setIsLogin(value);
  };

  useEffect(() => {
    CheckUser_HasLogin();
  }, []);

  return (
    <>
      {!isLogin ? (
        <Login gotoHome={checkA} />
      ) : (
        <NavigationContainer>
          <Drawer.Navigator>
            <Drawer.Screen name="home" component={dashboard} />
            <Drawer.Screen name="invoice" component={PageInvoice} />
            <Drawer.Screen name="thungan" component={PageThuNgan} />
          </Drawer.Navigator>
        </NavigationContainer>
      )}
    </>

    // <NavigationContainer>
    //   {isLogin == false ? (
    //     <Stack.Screen name="login">
    //       {(props) => <Login {...props} extraData={checkA} />}
    //     </Stack.Screen>
    //   ) : (
    //     <Stack.Navigator>
    //       <Stack.Screen name="home" component={dashboard} />
    //       <Stack.Screen name="invoice" component={PageInvoice} />
    //     </Stack.Navigator>
    //   )}
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
