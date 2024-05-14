import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { IHoaDonChiTietDto } from "../../api/invoices/hoaDonDto";
import SqliteClass from "../../lib/sqllite";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabGioHang({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const [listCTHD, setLstCTHD] = useState<IHoaDonChiTietDto[]>([]);

  useEffect(() => {
    GetDataFromCache();
    console.log("TabGioHang_navigation ", navigation, "route ", route);
  }, []);

  const GetDataFromCache = async () => {
    const db = await SqliteClass.OpenDatabase();
    const data = await db.getAllAsync("Select * from tblHoaDonChiTiet");
    if (data != null) {
      setLstCTHD(data as unknown as IHoaDonChiTietDto[]);
    }
  };
  return (
    <View style={style.container}>
      <FlatList
        data={listCTHD}
        renderItem={({ item }) => <View></View>}
      ></FlatList>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
});
