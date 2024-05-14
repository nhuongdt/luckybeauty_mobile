import TabListProduct from "./TabListProduct";
import { MaterialIcons } from "@expo/vector-icons";

import TabGioHang from "./TabGioHang";
import React, { useEffect, useState } from "react";
import sqllite from "../../lib/sqllite";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabBottom = createBottomTabNavigator();

export default function PageThuNgan({ navigation, route }: any) {
  const [countGioHang, setCountGioHang] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route?.params) {
      console.log(44, route?.params);
      setCountGioHang(route?.params?.countGioHang);
    }
  }, [route]);

  useEffect(() => {
    pageLoad();
  }, []);

  const pageLoad = async () => {
    const db = await sqllite.OpenDatabase();
    await sqllite.CreateTable_HoaDon(db);
    await sqllite.CreateTable_HoaDonChiTiet(db);
  };

  return (
    <TabBottom.Navigator
      screenOptions={{
        header: () => {
          return null;
        },
        tabBarStyle: {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      }}
    >
      <TabBottom.Screen
        name="TabSanPham"
        component={TabListProduct}
        options={{
          title: "",
          tabBarLabel: "Sản phẩm",
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons name={"list"} size={20} />
          ),
        }}
      />
      <TabBottom.Screen
        name="TabGioHang"
        component={TabGioHang}
        options={{
          tabBarStyle: { position: "relative" },
          title: "Giỏ hàng",
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons name={"add-shopping-cart"} size={20} />
          ),
          tabBarBadge: countGioHang,
        }}
      />
    </TabBottom.Navigator>
  );
}
