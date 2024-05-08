import {
  Pressable,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
export default function Login() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo_Luckybeauty_full.png")}
        style={{ resizeMode: "stretch", width: 200, height: 50 }}
      />
      <Text style={styles.lable}>Login</Text>
      <View
        style={{
          width: "100%",
          padding: 20,
          gap: 10,
        }}
      >
        <View style={styles.inputContainer}>
          <FontAwesome5 name="database" size={24} color="#aaa" />
          <TextInput placeholder="Id" style={styles.inputBox} />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome5 name="user-circle" size={24} color="#aaa" />
          <TextInput placeholder="Username" style={styles.inputBox} />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome5 name="key" size={24} color="#aaa" />
          <TextInput placeholder="Password" style={styles.inputBox} />
        </View>
      </View>
      <View style={{ width: "100%" }}>
        <Pressable style={styles.buttonBox}>
          <Text style={styles.textButton}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 20,
    backgroundColor: "yellow",
  },
  lable: {
    fontSize: 20,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  inputBox: {
    padding: 10,
    width: "100%",
    borderBottomWidth: 1,
  },
  buttonBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  textButton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
