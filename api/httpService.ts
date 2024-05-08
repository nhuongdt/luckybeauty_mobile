import axios from "axios";
const http = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  paramsSerializer: function (params) {
    return new URLSearchParams(params).toString();
  },
});
http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      !!error.response &&
      !!error.response.data.error &&
      !!error.response.data.error.message &&
      error.response.data.error.details
    ) {
    } else if (
      !!error.response &&
      !!error.response.data.error &&
      !!error.response.data.error.message
    ) {
      //
    } else if (!error.response) {
    }
    return Promise.reject(error);
  }
);
export default http;

export class htpService {
  get = async (serviceUrl: string, input: {}) => {
    const param = new URLSearchParams(input).toString();
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}${serviceUrl}?${param}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const jsonData = await response.json();
    } catch (error) {}
  };
  post = async (serviceUrl: string, input: {}) => {
    // todo header
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}${serviceUrl}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        }
      );
      const jsonData = await response.json();
      return jsonData.result;
    } catch (error) {
      return null;
    }
  };
}
