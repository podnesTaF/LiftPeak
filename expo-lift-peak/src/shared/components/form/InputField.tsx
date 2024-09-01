import React from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View, TouchableOpacity, StyleProp, TextStyle} from "react-native";
import { Colors } from "@shared/styles";

interface InputFieldProps {
    label?: string;
    type?: TextInputProps["textContentType"];
    placeholder?: string;
    value: string;
    onChange: (text: string) => void;
    onBlur?: () => void;
    keyboardType?: TextInputProps["keyboardType"];
    color?: string;
    inputStyle?: StyleProp<TextStyle>;
}

const InputField = ({ label, placeholder, type, value, onBlur, onChange, keyboardType, color, inputStyle}: InputFieldProps) => {

    return (
        <View style={styles.inputContainer}>
                <TextInput
                    placeholderTextColor={Colors.dark300}
                    textContentType={type}
                    autoCapitalize="none"
                    onChangeText={onChange}
                    keyboardType={keyboardType}
                    onBlur={onBlur}
                    value={value}
                    style={[styles.input, {backgroundColor: color || Colors.dark500}, inputStyle]}
                    secureTextEntry={type === "password"}
                    placeholder={placeholder}
                />
        </View>
    );
};
const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderRadius: 8,
        backgroundColor: Colors.dark500,
        color: Colors.white,
        paddingVertical: 12,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    label: {
        color: Colors.dark300,
        fontSize: 16,
    },
});

export default InputField;