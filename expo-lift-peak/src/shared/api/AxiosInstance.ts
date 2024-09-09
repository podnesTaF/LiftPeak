import { useAuthStore } from "@features/auth/store/authStore";
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.12:4000/api",
  // baseURL: "http://172.20.10.10:4000/api",

});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
