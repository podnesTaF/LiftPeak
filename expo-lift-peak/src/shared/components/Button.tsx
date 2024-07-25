import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from "react-native";
import {Colors} from "@shared/styles";
import {getContrastColor} from "@shared/utils";

interface ButtonProps {
    title: string;
    color: keyof typeof Colors;
    fullWidth?: boolean;
    disabled?: boolean;
    onPress?: () => void;
    children?: React.ReactNode;
}

const Button = ({color, children, title, onPress, fullWidth, disabled}: ButtonProps) => {
    const backgroundColor = disabled ? Colors.dark300 : Colors[color];
    const textColor = getContrastColor(backgroundColor);

    return (
        <TouchableOpacity disabled={!!disabled} onPress={onPress}
                          style={[
                              styles.buttonContainer,
                              { width: fullWidth ? "100%" : "auto", backgroundColor },
                              disabled && styles.buttonContainerDisabled
                          ]}
        >
            {children}
            <Text style={[styles.buttonText, {color: textColor}]}>
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
    },
    buttonContainerDisabled: {
        opacity: 0.3,
    },
})

export default Button;