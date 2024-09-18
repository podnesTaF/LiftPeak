import React, {useState} from 'react';
import {Controller, useFormContext} from "react-hook-form";
import {StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {TextInputMask} from "react-native-masked-text";

interface FormInputProps {
    name: string;
    type?: TextInputProps["textContentType"];
    placeholder?: string;
    inputStyle?: StyleProp<TextStyle>;
    startValue?: string;
    multiline?: boolean
}

const FormInput = ({name, type, inputStyle, placeholder, startValue, multiline}:FormInputProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();
    const [inputValue, setInputValue] = useState(startValue || '');

    const handleInputChange = (text: string, onChange: (value: string) => void) => {
        if (text.startsWith(startValue || '')) {
            setInputValue(text);
            onChange(text);
        } else {
            setInputValue(startValue || '');
            onChange(startValue || '');
        }
    };

    return (
        <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
                <View style={{gap: 6}}>
                    <TextInput
                        placeholderTextColor={Colors.dark300}
                        textContentType={type}
                        autoCapitalize="none"
                        onChangeText={(text) => handleInputChange(text, onChange)}
                        onBlur={onBlur}
                        value={inputValue}
                        style={[styles.input, inputStyle]}
                        secureTextEntry={type === "password"}
                        placeholder={placeholder}
                        editable={true}
                        multiline={multiline}
                    />
                    {errors[name] && (
                        <Text style={[defaultStyles.secondaryText, {color: Colors.danger}]}>
                            {errors[name]?.message?.toString()}
                        </Text>
                    )}
                </View>

            ) }
            name={name}
        />
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


export default FormInput;