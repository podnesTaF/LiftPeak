import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  TextStyle,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@shared/styles";
import { Ionicons } from "@expo/vector-icons";

interface TextInputProps {
  type: string;
  onChange: () => void;
  onBlur: () => void;
  value: string;
  autofocus: boolean;
  hasError: boolean;
  noValidationStyling: boolean;
  placeholder: string | undefined;
  showPasswordToggle?: boolean;
  style?: StyleProp<TextStyle>;
}

const TextInputField: React.FC<TextInputProps> = ({
    type,
    onChange,
    onBlur,
    value,
    autofocus,
    hasError,
    noValidationStyling,
    style,
    showPasswordToggle,
    placeholder
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(type === "password");
  const togglePasswordVisibility = () => {
    setSecureTextEntry((prev) => !prev);
  };

  return (
    <>
    <View>
      <TextInput
        multiline={type === "textarea"}
        maxLength={type === "textarea" ? 200 : 50}
        // numberOfLines={numberOfLines}
        placeholderTextColor={Colors.dark300}
        textContentType="oneTimeCode"
        autoCapitalize="none"
        onChangeText={onChange}
        onBlur={onBlur}
        value={value}
        autoFocus={autofocus}
        style={[
          styles.input,
          {
            height: type === "textarea" ? 100 : 48,
          },
          hasError && !!value && !noValidationStyling && styles.inputError,
          style,
        ]}
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
      </View>
    </>
  );
};

export default TextInputField;

const styles = StyleSheet.create({
  input: {
    fontSize: 18,
    borderRadius: 8,
    backgroundColor: Colors.dark500,
    color: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: "rgba(255, 0, 0, 0.5)",
    borderWidth: 1,
  },
  iconToggle: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
});
