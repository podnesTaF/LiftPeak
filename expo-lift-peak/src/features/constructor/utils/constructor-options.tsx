import React from "react";
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {Colors} from "@shared/styles";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export const equipmentOptions: {label: React.ReactNode, value: string | number, icon?: React.ReactNode}[]  = [
    {label: "Machine", value: "machine"},
    {label: "Barbell", value: "barbell", icon: <MaterialIcons name={"fitness-center"} size={24} color={"white"} />},
    {label: "Dumbbell", value: "dumbbell", icon: <Ionicons name={"barbell"} size={24} color={"white"} />},
    {label: "Kettlebell", value: "kettlebell", icon: <MaterialCommunityIcons name={"kettlebell"} size={24} color={"white"} />},
    {label: "Bodyweight", value: "bodyweight", icon: <FontAwesome name={"user"} size={24} color={"white"} />},
    {label: "Ball", value: "ball", icon: <MaterialCommunityIcons name={"tennis-ball"} size={24} color={"white"} />},
    {label: "Resistance Bands", value: "band"},
]

export const levelOptions: {label: React.ReactNode, value: string | number}[] = [
    {label: "Beginner", value: "beginner"},
    {label: "Intermediate", value: "intermediate"},
    {label: "Advanced", value: "advanced"},
]