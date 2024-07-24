import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from "react-native";
import {Colors} from "@/constants/Colors";
import {getContrastColor} from "@/utils/getConstrastCollor";

interface ButtonProps {
    title: string;
    color: keyof typeof Colors;
    fullWidth?: boolean;
    onPress?: () => void;
    children?: React.ReactNode;
}

const Button = ({color, children, title, onPress, fullWidth}: ButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, {width: fullWidth ? "100%" : "auto", backgroundColor: Colors[color]}]}>
            {children}
            <Text style={[styles.buttonText, {color: getContrastColor(Colors[color])}]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        paddingVertical: 14,
        paddingHorizontal: 14,
        flexDirection: "row",
        borderRadius: 8,
        alignItems: "center",
        gap: 8,
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "500"
    }
})

export default Button;