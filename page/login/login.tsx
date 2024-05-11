import {
  Pressable,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import loginService from "../../api/login/loginService";
import { ILoginModel, TenantStatus } from "../../api/login/loginDto";
import * as SecureStore from "expo-secure-store";

const logo = require("../../assets/logo_Luckybeauty_full.png");

export default function Login({ gotoHome }: any) {
  const [tenancyName, setTenancyName] = useState("");
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [errors, setErrors] = useState({
    userName: "",
    passWord: "",
    tenancyName: "",
  });

  useEffect(() => {
    setErrors({
      userName: "",
      passWord: "",
      tenancyName: "",
    });
  }, []);

  const onPressLogin = async () => {
    if (validateForm()) {
      const tenantData = await loginService.CheckExistTenant(tenancyName);
      if (tenantData.state == TenantStatus.AVAILABLE) {
        const input = {
          userNameOrEmailAddress: userName,
          password: passWord,
          rememberClient: true,
          tenantId: tenantData.tenantId,
        } as ILoginModel;
        const token = await loginService.CheckUser(input, tenantData.tenantId);
        if (token != null) {
          SecureStore.setItem("accessToken", token.accessToken);
          if (input.rememberClient) {
            SecureStore.setItem("user", JSON.stringify(input));
          }
          gotoHome(true);
        } else {
          gotoHome(false);
        }
      } else {
        switch (tenantData.state) {
          case TenantStatus.NOTFOUND:
            {
              setErrors({
                ...errors,
                tenancyName: "Id cửa hàng không tồn tại",
              });
            }
            break;
          case TenantStatus.INACTIVE:
            {
              setErrors({ ...errors, tenancyName: "Cửa hàng ngừng hoạt động" });
            }
            break;
          default:
            {
              //
            }
            break;
        }
      }
    }
  };

  const validateForm = () => {
    let errors = { userName: "", passWord: "", tenancyName: "" };
    if (!userName) errors.userName = "Vui lòng nhập tên đăng nhập";
    if (!passWord) errors.passWord = "Vui lòng nhập mật khẩu";
    if (!tenancyName) errors.tenancyName = "Vui lòng nhập Id cửa hàng";
    setErrors(errors);
    return (
      errors.userName == "" && errors.passWord == "" && errors.tenancyName == ""
    );
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <Image
        source={logo}
        style={{ resizeMode: "stretch", width: 200, height: 50 }}
      />
      <Text style={styles.lable}>Đăng nhập</Text>
      <View
        style={{
          width: "100%",
          padding: 20,
          gap: 10,
        }}
      >
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="database-outline"
            size={24}
            color="#aaa"
          />
          <View style={{ width: "100%" }}>
            <TextInput
              placeholder="Id"
              style={styles.inputBox}
              onChangeText={(newVal) => {
                setTenancyName(newVal);
                setErrors({ ...errors, tenancyName: "" });
              }}
            />
            {errors?.tenancyName ? (
              <Text style={styles.msgErr}>{errors?.tenancyName}</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome5 name="user-circle" size={24} color="#aaa" />
          <View style={{ width: "100%" }}>
            <TextInput
              placeholder="Username"
              style={styles.inputBox}
              onChangeText={(newVal) => {
                setUserName(newVal);
                setErrors({ ...errors, userName: "" });
              }}
            />
            {errors?.userName ? (
              <Text style={styles.msgErr}>{errors?.userName}</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Octicons name="key" size={24} color="#aaa" />
          <View style={{ width: "100%" }}>
            <TextInput
              placeholder="Password"
              style={styles.inputBox}
              onChangeText={(newVal) => {
                setPassWord(newVal);
                setErrors({ ...errors, passWord: "" });
              }}
            />
            {errors?.passWord ? (
              <Text style={styles.msgErr}>{errors.passWord}</Text>
            ) : null}
          </View>
        </View>
      </View>
      <View style={{ width: "100%" }}>
        <Pressable style={styles.buttonBox} onPress={onPressLogin}>
          <Text style={styles.textButton}>Login</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  msgErr: {
    color: "red",
    fontSize: 12,
    marginTop: 8,
  },
});
