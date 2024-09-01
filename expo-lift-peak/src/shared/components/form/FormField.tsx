import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextInput, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Colors } from "@shared/styles";
import { Ionicons } from "@expo/vector-icons";

interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: "emailAddress" | "password" | "name";
  noValidationStyling?: boolean;
  showPasswordToggle?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  placeholder,
  type = "name",
  noValidationStyling = false,
  showPasswordToggle = false
}) => {
  const {
    control,
    formState: { errors},
  } = useFormContext();

  const [secureTextEntry, setSecureTextEntry] = useState(type === "password")

  const togglePasswordVisibility = () => {
    setSecureTextEntry((prev) => !prev);
  }

  const hasError = !!errors[name];

  


  return (
    <>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{gap: 8}}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={{ gap: 8, flexDirection: "row" }}>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholderTextColor={Colors.dark300}
                  textContentType={type}
                  autoCapitalize="none"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  style={[styles.input, hasError && value && !noValidationStyling && styles.inputError]}
                  secureTextEntry={secureTextEntry}
                  placeholder={placeholder}
                />
                {showPasswordToggle && type === "password" && (
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={styles.iconToggle}
                  >
                    <Ionicons
                      name={secureTextEntry ? "eye-off" : "eye"}
                      size={20}
                      color={Colors.dark300}
                    />
                  </TouchableOpacity>
                )}
                {value !== "" && value !== undefined && !noValidationStyling && (
                  <Ionicons
                    name={hasError ? "close-circle" : "checkmark-circle"}
                    size={20}
                    color={hasError ? Colors.danger : Colors.success}
                    style={styles.icon}
                  />
                )}
              </View>
            </View>
          </View>
        )}
        name={name}
      />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputWrapper: {
    position: 'relative',
    flex: 1
  },
  iconToggle: {
    position: 'absolute',
    right: 20, 
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  input: {
    borderRadius: 8,
    backgroundColor: Colors.dark500,
    color: Colors.white,
    paddingVertical: 12,
    fontSize: 18,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: "rgba(255, 0, 0, 0.5)",
    borderWidth: 1,
  },
  iconContainer: {
    width: 24,
    alignItems: "center",
    justifyContent: 'center'
  },
  icon: {
    position: 'absolute',
    right: 10, 
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  label: {
    color: Colors.dark300,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default FormField;
