import React from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View, TouchableOpacity, StyleProp, TextStyle} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import { TextInputMask } from 'react-native-masked-text';

interface InputFieldProps {
    label?: string;
    type?: TextInputProps["textContentType"];
    placeholder?: string;
    value: string;
    onChange: (text: string, extracted?: string) => void;
    onBlur?: () => void;
    keyboardType?: TextInputProps["keyboardType"];
    color?: string;
    inputStyle?: StyleProp<TextStyle>;
    activeText?: boolean
    mask?: string
}

const InputField = ({ label, activeText,placeholder, type, value, onBlur, onChange, keyboardType, color, inputStyle, mask}: InputFieldProps) => {

    return (
        <View style={styles.inputContainer}>
            {label && (
                <Text style={defaultStyles.secondaryText}>
                    {label}
                </Text>
            )}
            {!mask ? <TextInput
                placeholderTextColor={Colors.dark300}
                textContentType={type}
                autoCapitalize="none"
                onChangeText={onChange}
                keyboardType={keyboardType}
                onBlur={onBlur}
                value={value}
                style={[styles.input, {
                    backgroundColor: color || Colors.dark500,
                    color: activeText ? Colors.white : Colors.dark300
                }, inputStyle]}
                secureTextEntry={type === "password"}
                placeholder={placeholder}
            /> : (
                <TextInputMask
                    type={'custom'}
                    placeholderTextColor={Colors.dark300}
                    autoCapitalize="none"
                    onChangeText={onChange}
                    keyboardType={"numeric"}
                    onBlur={onBlur}
                    value={value}
                    options={{
                        mask
                    }}
                    style={[styles.input, {
                        backgroundColor: color || Colors.dark500,
                        color: activeText ? Colors.white : Colors.dark300
                    }, inputStyle]}
                    secureTextEntry={type === "password"}
                    placeholder={placeholder}
                />
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    inputContainer: {
        gap: 10,
        flex: 1
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