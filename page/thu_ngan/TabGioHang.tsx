import { StyleSheet, Text, View } from "react-native";

export default function TabGioHang() {
  return (
    <View style={style.container}>
      <Text>list gio hang</Text>
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
