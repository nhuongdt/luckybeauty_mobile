import * as SecureStore from "expo-secure-store";

class htpService {
  get = async (serviceUrl: string, input: {}) => {
    const param = new URLSearchParams(input).toString();
    try {
      const accessToken = SecureStore.getItem("accessToken");
      if (accessToken) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${accessToken}`);
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        const requestOptions: RequestInit = {
          method: "GET",
          headers: myHeaders,
        };

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}${serviceUrl}?${param}`,
          requestOptions
        );
        const jsonData = await response.json();
        return jsonData.result;
      }
    } catch (error) {}
    return null;
  };
  post = async (serviceUrl: string, input: {}) => {
    try {
      const accessToken = SecureStore.getItem("accessToken");
      if (accessToken) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${accessToken}`);
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        const requestOptions: RequestInit = {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(input),
        };

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}${serviceUrl}`,
          requestOptions
        );

        const jsonData = await response.json();
        return jsonData.result;
      }
      return null;
    } catch (error) {
      console.log("jsonData_error ", error);
      return null;
    }
  };
}
export default new htpService();
