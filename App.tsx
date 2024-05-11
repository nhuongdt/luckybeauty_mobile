import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  useWindowDimensions,
  View,
  Pressable,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as SecureStore from "expo-secure-store";
import { FontAwesome5 } from "@expo/vector-icons";
import dashboard from "./page/dashboard/dashboard";
import PageInvoice from "./page/invoice/PageInvoice";
import Login from "./page/login/login";
import loginService from "./api/login/loginService";
import PageThuNgan from "./page/thu_ngan/PageThuNgan";
import { ILoginModel } from "./api/login/loginDto";
import NavBarUser from "./page/user/navbarUser";
const bgImage = require("./assets/bg_01.png");
const Drawer = createDrawerNavigator();

export default function App() {
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const [userLogin, setUserLogin] = useState<ILoginModel>({} as ILoginModel);

  const CheckUser_HasLogin = async () => {
    try {
      const dataUser = await loginService.CheckUser_fromCache();
      if (dataUser != null) {
        const token = await loginService.CheckUser(
          dataUser,
          dataUser.tenantId ?? 0
        );
        if (token != null) {
          setIsLogin(true);
          setUserLogin({
            ...userLogin,
            userNameOrEmailAddress: dataUser.userNameOrEmailAddress,
          });

          SecureStore.setItem("accessToken", token.accessToken);
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

  const GetInforUserLogin = async () => {
    //
  };
  const onLoginOK = (value: boolean) => {
    setIsLogin(value);
  };

  const onLogout = () => {
    setIsLogin(false);
    SecureStore.deleteItemAsync("user");
  };

  useEffect(() => {
    CheckUser_HasLogin();
  }, []);

  if (isLoadingForm) {
    return (
      <ImageBackground
        source={bgImage}
        resizeMode="stretch"
        style={{ flex: 1, justifyContent: "center" }}
      >
        <ActivityIndicator color="#0000ff" />
      </ImageBackground>
    );
  }

  return (
    <>
      <StatusBar backgroundColor="yellow" />
      {!isLogin ? (
        <Login gotoHome={onLoginOK} />
      ) : (
        <NavigationContainer>
          <Drawer.Navigator
            screenOptions={{
              headerRight: () => (
                <Pressable
                  style={{ padding: 4, position: "relative" }}
                  onPressIn={() => setOpenUser(!openUser)}
                >
                  <FontAwesome5 name="user-circle" size={24} />
                  <NavBarUser
                    open={openUser}
                    dataUser={userLogin}
                    onClose={onLogout}
                  />
                </Pressable>
              ),
            }}
          >
            <Drawer.Screen
              name="home"
              options={{
                title: "Trang chủ",
              }}
              component={dashboard}
            />
            <Drawer.Screen
              name="invoice"
              options={{ title: "Hóa đơn" }}
              component={PageInvoice}
            />
            <Drawer.Screen
              name="thungan"
              options={{ title: "Thu ngân" }}
              component={PageThuNgan}
            />
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
