import { StyleSheet, Text, View } from "react-native";

export default function PageInvoice() {
  return (
    <View style={style.container}>
      <Text>list invoice</Text>
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
