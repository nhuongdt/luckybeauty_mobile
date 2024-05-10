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
import { useState } from "react";
import loginService from "../../api/login/loginService";
import { ILoginModel, TenantStatus } from "../../api/login/loginDto";
import commonFunc from "../../utils/commonFunc";
import * as SecureStore from "expo-secure-store";

export default function Login({ gotoHome }: any) {
  const [tenancyName, setTenancyName] = useState("");
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [errors, setErrors] = useState({ userName: "", passWord: "" });

  const [tenancyName_MsgErr, setTenancyName_MsgErr] = useState("");
  const [userName_MsgErr, setUserName_MsgErr] = useState("");
  const [passWord_MsgErr, setPassWord_MsgErr] = useState("");

  const onPressLogin = async () => {
    // if (validateForm()) {
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
            setTenancyName_MsgErr("Id cửa hàng không tồn tại");
          }
          break;
        case TenantStatus.INACTIVE:
          {
            setTenancyName_MsgErr("Cửa hàng ngừng hoạt động");
          }
          break;
        default:
          {
            // loix serrverr
          }
          break;
      }
    }
    // }
  };

  const validateForm = () => {
    let errors = { userName: "", passWord: "" };
    if (!userName) errors.userName = "Username required";
    if (!passWord) errors.passWord = "passWord required";
    setErrors(errors);
    return Object.keys(errors).length == 0;
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <Image
        source={require("../../assets/logo_Luckybeauty_full.png")}
        style={{ resizeMode: "stretch", width: 200, height: 50 }}
      />
      <Text style={styles.lable}>Login</Text>
      <View
        style={{
          width: "100%",
          padding: 20,
          columnGap: 10,
        }}
      >
        <View style={styles.inputContainer}>
          <FontAwesome5 name="database" size={24} color="#aaa" />
          <View
            style={[
              styles.inputBoxErr,
              !commonFunc.checkNull(tenancyName_MsgErr) && { rowGap: 8 },
            ]}
          >
            <TextInput
              placeholder="Id"
              style={styles.inputBox}
              onChangeText={(newVal) => {
                setTenancyName(newVal);
                setTenancyName_MsgErr("");
              }}
            />
            <Text style={styles.msgErr}>{tenancyName_MsgErr}</Text>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome5 name="user-circle" size={24} color="#aaa" />
          <View
            style={[
              styles.inputBoxErr,
              !commonFunc.checkNull(userName_MsgErr) && { rowGap: 8 },
            ]}
          >
            <TextInput
              placeholder="Username"
              style={styles.inputBox}
              onChangeText={(newVal) => setUserName(newVal)}
            />
            {errors?.userName ? (
              <Text style={styles.msgErr}>{errors?.userName}</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome5 name="key" size={24} color="#aaa" />
          <View
            style={[
              styles.inputBoxErr,
              !commonFunc.checkNull(passWord_MsgErr) && { rowGap: 8 },
            ]}
          >
            <TextInput
              placeholder="Password"
              style={styles.inputBox}
              onChangeText={(newVal) => setPassWord(newVal)}
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
  inputBoxErr: {
    width: "100%",
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
