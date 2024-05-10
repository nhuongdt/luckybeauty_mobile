import { StyleSheet, Text, View } from "react-native";
import TabListProduct from "./TabListProduct";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import TabGioHang from "./TabGioHang";
const Tab = createBottomTabNavigator();

const TabTop = createMaterialTopTabNavigator();

export default function PageThuNgan() {
  return (
    <TabTop.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName: any;

          if (route.key === "thungan_listProduct") {
            iconName = focused ? "list" : "list";
          } else if (route.key === "thungan_shoppingcar") {
            iconName = focused ? "shopping-cart" : "shopping-cart";
          }
          return <MaterialIcons name={iconName} color={color} />;
        },
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <TabTop.Screen
        name="Sản phẩm"
        key={"thungan_listProduct"}
        component={TabListProduct}
      />
      <TabTop.Screen
        name="Giỏ hàng"
        key={"thungan_shoppingcar"}
        component={TabGioHang}
      />
    </TabTop.Navigator>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});
