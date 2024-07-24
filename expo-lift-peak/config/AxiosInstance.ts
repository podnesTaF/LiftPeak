import axios from 'axios';
import {useAuthStore} from "@/store/auth";

const api = axios.create({
    baseURL: 'http://192.168.1.39:4000/api',
});

api.interceptors.request.use(
    config => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;