import { mmkvStorage } from "../store/mmkvStore";
// import { REACT_NATIVE_API_URL } from '@env';

const REACT_NATIVE_API_URL ='https://api.luckybeauty.vn/';
class api {
  headerConfig = () => {
    const accessToken = mmkvStorage.getString("accessToken");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    return myHeaders;
  };
  get = async (urlApi: string, input?: any) => {
    try {
      let newUrl = `${REACT_NATIVE_API_URL}${urlApi}`;
      if (input) {
        const inputQuery = new URLSearchParams(input).toString();
        newUrl = `${newUrl}?${inputQuery}`;
      }
      const response = await fetch(newUrl, {
        headers: this.headerConfig(),
      });
      if (response.ok) {
        const data = await response.json();
        return data.result;
      }
      return null;
    } catch (error) {
      console.log(`${urlApi} error ${error}`);
      return null;
    }
  };
  post = async (urlApi: string, input?: any) => {
    try {
      const response = await fetch(
        `${REACT_NATIVE_API_URL}${urlApi}`,
        {
          method: "POST",
          body: input ? JSON.stringify(input) : null,
          headers: this.headerConfig(),
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.result;
      }
      return null;
    } catch (error) {
      console.log(`${urlApi} error ${error}`);
      return null;
    }
  };
}

export default new api();
