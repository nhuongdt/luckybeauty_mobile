import http from "../httpService";
import { IAuthenResultModel, ILoginModel } from "./loginDto";
import * as SecureStore from "expo-secure-store";

class LoginService {
  CheckUser_fromCache = async (): Promise<ILoginModel | null> => {
    let user = await SecureStore.getItemAsync("user");
    if (user) {
      const dataUser = JSON.parse(user);
      console.log("user ", JSON.parse(user));

      const userLogin: ILoginModel = {
        userNameOrEmailAddress: dataUser.userNameOrEmailAddress,
        password: dataUser.password,
        rememberClient: dataUser.rememberClient,
        tenantId: dataUser?.tennatId ?? 0,
      };
      return userLogin;
    }
    return null;
  };
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
  CheckUser = async (
    input: ILoginModel,
    tennatId: number
  ): Promise<IAuthenResultModel | null> => {
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
      return jsonData.result;
    } catch (error) {
      console.log("loginuee ", error);
    }
    return null;
  };
}
export default new LoginService();
