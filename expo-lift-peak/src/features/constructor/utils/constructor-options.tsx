import React from "react";
import {IEquipment} from "@entities/exercise";
import {Image} from "react-native";
import {SvgUri} from "react-native-svg";

export const getEquipmentOptions = (equipments?: IEquipment[]) => {
    return equipments?.map(e => ({
        label: e.name,
        value: e.id,
        icon: e.iconUrl ? <SvgUri height={"32"} width={"32"} uri={e.iconUrl} /> : undefined
    }))
}

export const levelOptions: {label: React.ReactNode, value: string | number}[] = [
    {label: "Beginner", value: "BEGINNER"},
    {label: "Intermediate", value: "INTERMEDIATE"},
    {label: "Advanced", value: "ADVANCED"},
]