import {IUser} from "@entities/user";

export interface IGym {
    id?: number;
    name: string;
    address: string;
    longitude: number;
    latitude: number;
    users: IUser[];
}