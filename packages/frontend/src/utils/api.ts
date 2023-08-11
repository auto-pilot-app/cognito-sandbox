import axios from "axios";
import { Auth } from "@aws-amplify/auth";

const defaultTransformers = () => {
  const { transformRequest } = axios.defaults;
  if (!transformRequest) {
    return [];
  } else if (transformRequest instanceof Array) {
    return transformRequest;
  } else {
    return [transformRequest];
  }
};

const apiBuild = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 180000,
  transformRequest: [...defaultTransformers()],
});

apiBuild.interceptors.request.use(
  async (config) => {
    try {
      const session = await Auth.currentSession();
      const token = session.getAccessToken().getJwtToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (err) {
      // TO DO: CHECK WHICH CODE BELONG TO AN EXPIRED REFRESH TOKEN ERROR
      if (err === "No current user" || err.code === "NoAuthenticatedUser") {
        window.location.replace("/logout");
      }
      return Promise.reject(err);
    }
  },
  (error) => {
    if (error === "No current user" || error.code === "NoAuthenticatedUser") {
      window.location.replace("/logout");
    }
    return Promise.reject(error);
  }
);

export const api = apiBuild;
