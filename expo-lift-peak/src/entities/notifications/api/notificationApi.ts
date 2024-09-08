import api from "@shared/api/AxiosInstance";
import {INotification} from "@entities/notifications/model/INotification";

export const getUserNotifications = async () => {
    const {data: {data}} = await api.get<{ data: INotification[] }>("/notifications")
    return data
}

export const seenNotification = async () => {
    const {data} = await api.patch(`/notifications/seen`)

    return data
}

export const getUnseenCount = async  () => {
    const {data} = await api.get<number>("/notifications/unseen")
    return data
}