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
}

const InputField = ({ label, placeholder, type, value, onBlur, onChange }: InputFieldProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const cancelAnimation = useSharedValue(0);
    const inputRef = useRef<TextInput>(null);


    const cancelWidth = useSharedValue(0);

    const animatedCancelStyle = useAnimatedStyle(() => {
        return {
            width: withTiming(cancelWidth.value, { duration: 100 }),
            opacity: withTiming(cancelWidth.value > 0 ? 1 : 0, { duration: 200 }),
        };
    });

    const handleFocus = () => {
        setIsFocused(true);
        cancelWidth.value = 80;
    };


    const handleBlur = () => {
        setIsFocused(false);
        cancelWidth.value = 0;
        if (onBlur) onBlur();
    };

    const handleClear = () => {
        onChange('');
    };

    const handleCancel = () => {
        if (inputRef.current) {
            inputRef.current.blur(); // Call blur() on the inputRef to remove focus
        }
        handleBlur();
    };

    return (
        <View style={styles.inputContainer}>
            <View style={{flexDirection: "row", position: "relative"}}>
                   <TextInput
                       placeholderTextColor={Colors.dark300}
                       textContentType={type}
                       autoCapitalize="none"
                       onChangeText={onChange}
                       onFocus={handleFocus}
                       onBlur={handleBlur}
                       value={value}
                       ref={inputRef}
                       style={styles.input}
                       secureTextEntry={type === "password"}
                       placeholder={placeholder}
                   />
                <Animated.View style={[styles.cancelButtonContainer, animatedCancelStyle]}>
                    <TouchableOpacity onPress={handleCancel}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
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