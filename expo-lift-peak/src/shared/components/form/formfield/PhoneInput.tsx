import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "@shared/styles";
import { Ionicons } from "@expo/vector-icons";
import PhoneInput from "react-native-phone-number-input";

interface PhoneInputFieldProps {
  value: string;
  onChange: () => void;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  value,
  onChange,
}) => {
  return (
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
  );
};

export default PhoneInputField;

const styles = StyleSheet.create({
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
});
