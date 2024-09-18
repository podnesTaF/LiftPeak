import {
  View,
  Text,
  Pressable,
  TextInput,
  Platform,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@shared/styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "../../Button";

interface DateInputProps {
  placeholder: string | undefined;
  value: string;
  onChange: (date: string | undefined) => void;
}

const DateInputField: React.FC<DateInputProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  return (
    <>
      {!showPicker && (
        <Pressable onPress={toggleDatepicker}>
          <TextInput
            editable={false}
            placeholder={placeholder}
            pointerEvents="none"
            value={value ? value : ""}
            style={styles.input}
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
      {showPicker && Platform.OS === "ios" && (
        <View style={styles.datePickerButtons}>
          <Button
            onPress={toggleDatepicker}
            color="dark500"
            title="Confirm birthdate"
          />
        </View>
      )}
    </>
  );
};

export default DateInputField;

const styles = StyleSheet.create({
  input: {
    fontSize: 18,
    borderRadius: 8,
    backgroundColor: Colors.dark500,
    color: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  datePicker: {
    height: 160,
    marginTop: -10,
  },
  datePickerButtons: {
    paddingTop: 10,
  },
});
