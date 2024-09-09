import React from "react";
import {IEquipment} from "@entities/exercise";
import {Image} from "react-native";
import {SvgUri} from "react-native-svg";

export const getEquipmentOptions = (equipments?: IEquipment[]) => {
    console.log("equipments", equipments)
    return equipments?.map(e => ({
        label: e.name,
        value: e.id,
        icon: e.iconUrl ? <SvgUri height={"32"} width={"32"} uri={e.iconUrl} /> : undefined
    }))
}

export const levelOptions: {label: React.ReactNode, value: string | number}[] = [
    {label: "Beginner", value: "beginner"},
    {label: "Intermediate", value: "intermediate"},
    {label: "Advanced", value: "advanced"},
]