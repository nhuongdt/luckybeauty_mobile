import { View, StyleSheet, Text, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default function NavBarUser({ open, dataUser, onClose }: any) {
  return (
    <View style={[styles.container, { display: open ? "flex" : "none" }]}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontWeight: "600" }}>
          {dataUser?.userNameOrEmailAddress}
        </Text>
      </View>

      <View style={{ marginTop: 16, gap: 8 }}>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FontAwesome5 name="user-circle" size={24} />
          <Text>Hồ sơ</Text>
        </Pressable>
        <Pressable
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: 8,
          }}
          onPress={onClose}
        >
          <Ionicons name="arrow-redo-outline" size={24} />
          <Text>Đăng xuất</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf0",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    padding: 16,
    zIndex: 1,
    top: 25,
    right: 2,
    borderWidth: 1,
    borderRadius: 4,
  },
});
