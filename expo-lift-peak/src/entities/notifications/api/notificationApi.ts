import api from "@shared/api/AxiosInstance";
import {INotification} from "@entities/notifications/model/INotification";

export const getUserNotifications = async () => {
    const {data: {data}} = await api.get<{ data: INotification[] }>("/notifications")
    return data
}