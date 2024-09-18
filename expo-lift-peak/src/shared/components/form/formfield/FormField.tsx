import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Platform,
  Pressable,
  StyleProp,
  TextStyle,
} from "react-native";
import { Colors } from "@shared/styles";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Button from "../../Button";
import PhoneInput from "./PhoneInput";
import DateInputField from "./DateInput";
import TextInputField from "./TextInputField";

interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: "emailAddress" | "password" | "name" | "phone" | "date" | "textarea";
  noValidationStyling?: boolean;
  showPasswordToggle?: boolean;
  autofocus?: boolean;
  style?: StyleProp<TextStyle>;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  placeholder,
  type = "name",
  noValidationStyling = false,
  showPasswordToggle = false,
  autofocus = false,
  style,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const hasError = !!errors[name];

  return (
    <>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{ gap: 8 }}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={{ gap: 8, flexDirection: "row" }}>
              <View style={styles.inputWrapper}>
                {type === "phone" ? (
                  <PhoneInput value={value} onChange={onChange} />
                ) : type === "date" ? (
                  <DateInputField
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                  />
                ) : (
                  <TextInputField
                    type={type}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    autofocus={autofocus}
                    hasError={hasError}
                    noValidationStyling={noValidationStyling}
                    style={style}
                    showPasswordToggle={showPasswordToggle}
                    placeholder={placeholder}
                  />
                )}

                {value !== "" &&
                  value !== undefined &&
                  !noValidationStyling && (
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
  inputWrapper: {
    position: "relative",
    flex: 1,
  },
  icon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  label: {
    color: Colors.dark300,
    fontSize: 16,
  },
});

export default FormField;
