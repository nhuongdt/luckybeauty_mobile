import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Dashboard({ navigation }: any) {
  return (
    <SafeAreaView style={style.container}>
      <Text>home</Text>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },
});
