import { StyleSheet, Text, View } from "react-native";
import TabListProduct from "./TabListProduct";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import TabGioHang from "./TabGioHang";
const Tab = createBottomTabNavigator();

const TabTop = createMaterialTopTabNavigator();

export default function PageThuNgan() {
  return (
    <TabTop.Navigator>
      <TabTop.Screen
        name="Sản phẩm"
        key={"thungan_listProduct"}
        component={TabListProduct}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons name={"list"} size={20} />
          ),
        }}
      />
      <TabTop.Screen
        name="Giỏ hàng"
        key={"thungan_shoppingcar"}
        component={TabGioHang}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons name={"add-shopping-cart"} size={20} />
          ),
        }}
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
