import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import dashboard from "./page/dashboard/dashboard";
import PageInvoice from "./page/invoice/PageInvoice";
import Login from "./page/login/login";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* <Stack.Screen name="login" component={Login} /> */}
      <Stack.Navigator>
        <Stack.Screen name="Đăng nhập" component={Login} />
        {/* <Stack.Screen name="home" component={dashboard} />
        <Stack.Screen name="invoice" component={PageInvoice} /> */}
      </Stack.Navigator>
    </NavigationContainer>
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
