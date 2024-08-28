import api from "@shared/api/AxiosInstance";
import * as FileSystem from 'expo-file-system';

export const uploadMedia = async (mediaFiles: string[], prefix: string = "images"): Promise<string | null> => {
    const formData = new FormData();
    for (const uri of mediaFiles) {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
            return null;
        }
        const fileUri = uri;
        const fileName = fileUri.split('/').pop();
        const fileType = `image/${fileName?.split('.').pop()}`;

        const file: any = {
            uri: fileUri,
            name: fileName,
            type: fileType,
        };

        formData.append('file', file);
        formData.append("prefix", prefix);
    }

    const {data} = await api.post<{ mediaUrl: string }>(`/media`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return data.mediaUrl;
}

export const deleteMedia = async (mediaUrl: string) => {
    await api.delete(`/media`, {params: {url: mediaUrl}});
    return mediaUrl;
}