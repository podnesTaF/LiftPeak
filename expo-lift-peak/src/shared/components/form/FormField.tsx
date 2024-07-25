import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {TextInput, StyleSheet, Text, View} from "react-native";
import {Colors} from "@shared/styles";

interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: "emailAddress" | "password" | "name";
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  placeholder, type = "name"
}) => {
  const { control, formState: { errors } } = useFormContext();

  const hasError = !!errors[name];

  return (
      <>
        <Controller
            control={control}
            render={({ field: { onChange, onBlur, value }  }) => (
                <View style={{gap:8}}>
                  {label && <Text style={styles.label}>{label}</Text>}
                  <TextInput
                      placeholderTextColor={Colors.dark300}
                      textContentType={type}
                      autoCapitalize="none"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                      style={[
                        styles.input,
                        hasError && styles.inputError,
                      ]}
                      secureTextEntry={type === "password"}
                      placeholder={placeholder}
                  />
                  {hasError && <Text style={styles.errorText}>{(errors[name] as any)?.message}</Text>}
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
  label: {
    color: Colors.dark300,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});


export default FormField;
