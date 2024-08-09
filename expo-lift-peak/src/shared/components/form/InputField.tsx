import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, TouchableOpacity } from "react-native";
import { Colors } from "@shared/styles";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import {Ionicons} from "@expo/vector-icons";

interface InputFieldProps {
    label?: string;
    type?: TextInputProps["textContentType"];
    placeholder?: string;
    value: string;
    onChange: (text: string) => void;
    onBlur?: () => void;
}

interface InputFieldProps {
    label?: string;
    type?: TextInputProps["textContentType"];
    placeholder?: string;
    value: string;
    onChange: (text: string) => void;
    onBlur?: () => void;
    keyboardType?: TextInputProps["keyboardType"];
}

const InputField = ({ label, placeholder, type, value, onBlur, onChange, keyboardType}: InputFieldProps) => {


    return (
        <View style={styles.inputContainer}>
            <View style={{flexDirection: "row", position: "relative"}}>
                   <TextInput
                       placeholderTextColor={Colors.dark300}
                       textContentType={type}
                       autoCapitalize="none"
                       onChangeText={onChange}
                       keyboardType={keyboardType}
                       onBlur={onBlur}
                       value={value}
                       style={styles.input}
                       secureTextEntry={type === "password"}
                       placeholder={placeholder}
                   />
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderRadius: 8,
        backgroundColor: Colors.dark500,
        color: Colors.white,
        paddingVertical: 24,
        fontSize: 18,
        paddingHorizontal: 16,
    },
    cancelButtonContainer: {
        justifyContent: 'center',
        alignItems: "center",
        overflow: 'hidden',
        position: 'relative',
        width: 80
    },
    cancelButtonText: {
        color: Colors.dark300,
        fontSize: 16,
        paddingHorizontal: 8,
    },
    label: {
        color: Colors.dark300,
        fontSize: 16,
    },
});

export default InputField;