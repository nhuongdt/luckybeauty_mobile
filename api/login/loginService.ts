import http from "../httpService";
import { ILoginModel } from "./loginDto";
import * as Keychain from "react-native-keychain";

class LoginService {
  CheckExistTenant = async (
    tenantName: string
  ): Promise<{ state: number; tenantId: number }> => {
    try {
      const param = {
        tenancyName: tenantName,
      };
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}api/services/app/Account/IsTenantAvailable`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(param),
        }
      );
      const jsonData = await response.json();
      return jsonData.result;
    } catch (error) {
      console.error("CheckExistTenant:", error);
    }
    return { state: 0, tenantId: 0 };
  };
  CheckUser = async (input: ILoginModel, tennatId: number): Promise<any> => {
    let errMsg = "";
    try {
      const myHeaders = new Headers();
      myHeaders.append("Abp.TenantId", tennatId.toString());
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(input),
      };
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}api/TokenAuth/Authenticate`,
        requestOptions
      );
      const jsonData = await response.json();

      if (jsonData.success && jsonData.result != null) {
        if (input.rememberClient) {
          await Keychain.setGenericPassword(
            input.userNameOrEmailAddress,
            jsonData.result.accessToken
          );
        }
        // set cookies
        console.log("jsonData.result_OK  ", jsonData.result);
        return "";
      }
      errMsg = jsonData.error;
      return jsonData.error;
    } catch (error) {
      console.log("loginuee ", error);
    }
    return errMsg;
  };

  checkuser2 = async (input: ILoginModel, tennatId: number) => {
    console.log("input ", input, "tennatId ", tennatId);
    const param = {
      userNameOrEmailAddress: input.userNameOrEmailAddress,
      password: input.password,
      rememberClient: input.rememberClient,
    };
    try {
      const apiResult = await http.post(
        "https://api.luckybeauty.vn/api/TokenAuth/Authenticate",
        param,
        {
          headers: {
            "Abp.TenantId": tennatId,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("error ", error);
    }
  };
}
export default new LoginService();
