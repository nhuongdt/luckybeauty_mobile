import { StyleSheet, Text, View } from "react-native";

export default function Dashboard() {
  return (
    <View style={style.container}>
      <Text>home</Text>
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
