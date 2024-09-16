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
  Pressable, StyleProp, TextStyle,
} from "react-native";
import { Colors } from "@shared/styles";
import { Ionicons } from "@expo/vector-icons";
import PhoneInput from "react-native-phone-number-input";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Button from "../Button";





interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: "emailAddress" | "password" | "name" | "phone" | "date";
  noValidationStyling?: boolean;
  showPasswordToggle?: boolean;
  autofocus?: boolean;
  style?: StyleProp<TextStyle>
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

  const [secureTextEntry, setSecureTextEntry] = useState(type === "password");
  const [showPicker, setShowPicker] = useState(false);



  const togglePasswordVisibility = () => {
    setSecureTextEntry((prev) => !prev);
  };

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };


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
                  <PhoneInput
                    defaultValue={value}
                    defaultCode="US"
                    layout="first"
                    onChangeFormattedText={onChange}
                    containerStyle={[styles.phoneContainer]}
                    textContainerStyle={[styles.phoneTextContainer]}
                    flagButtonStyle={[styles.phoneFlagButton]}
                    textInputProps={{
                      placeholder: "",
                      selectionColor: undefined,
                    }}
                    codeTextStyle={{ color: Colors.white }}
                    textInputStyle={{ color: Colors.white }}
                    countryPickerProps={{
                      withAlphaFilter: true,
                      theme: {
                        backgroundColor: Colors.dark700,
                        onBackgroundTextColor: Colors.white,
                      },
                      flatListProps: {
                        contentContainerStyle: {
                          paddingHorizontal: 16,
                          marginTop: 6,
                        },
                      },
                    }}
                    renderDropdownImage={
                      <Ionicons
                        name="chevron-down-outline"
                        size={20}
                        color={Colors.dark300}
                      />
                    }
                    onChangeText={onChange}
                  />
                ) : type === "date" ? (
                  <>
                    {!showPicker && (
                      <Pressable onPress={toggleDatepicker}>
                        <TextInput
                          editable={false}
                          placeholder={placeholder}
                          pointerEvents="none"
                          value={value ? value : ""}
                          style={[
                            styles.input,
                            hasError &&
                              value &&
                              !noValidationStyling &&
                              styles.inputError,
                          ]}
                          placeholderTextColor={Colors.dark300}
                        />
                      </Pressable>
                    )}
                    {showPicker && (
                      <DateTimePicker
                        mode="date"
                        value={value ? new Date(value) : new Date()}
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, date) => {
                          onChange(date?.toDateString());
                        }}
                        style={styles.datePicker}
                      />
                    )}
                      {showPicker && Platform.OS === 'ios' &&
                    (
                    <View style={styles.datePickerButtons}>
                      <Button onPress={toggleDatepicker} color="dark500" title="Confirm birthdate"/>
                    </View>
                    
                    )
                  }
                  </>
                ) : (
                  <TextInput
                    placeholderTextColor={Colors.dark300}
                    textContentType="oneTimeCode"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    autoFocus={autofocus}
                    style={[
                      styles.input,
                      hasError &&
                        value &&
                        !noValidationStyling &&
                        styles.inputError,
                        style
                    ]}
                    secureTextEntry={secureTextEntry}
                    placeholder={placeholder}
                  />
                )}
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
  container: {
    padding: 16,
  },
  inputWrapper: {
    position: "relative",
    flex: 1
  },
  iconToggle: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  input: {
    fontSize: 18,
    borderRadius: 8,
    backgroundColor: Colors.dark500,
    color: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  phoneContainer: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: Colors.dark500,
  },
  phoneTextContainer: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: Colors.dark500,
  },
  phoneFlagButton: {
    borderRightWidth: 1,
    borderRightColor: Colors.dark700,
  },
  calendarCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  calendarModalView: {
    margin: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: "90%",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputError: {
    borderColor: "rgba(255, 0, 0, 0.5)",
    borderWidth: 1,
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
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  datePicker: {
    height: 160,
    marginTop: -10,
  },
  datePickerButtons: {
    
    paddingTop: 10
  }
});

export default FormField;
