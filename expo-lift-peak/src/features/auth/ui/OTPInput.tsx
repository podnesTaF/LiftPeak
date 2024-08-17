import { Colors, defaultStyles } from "@shared/styles";
import { useRef } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";

interface OTPInputProps {
  length: number;
  value: string[];
  disabled: boolean;
  onChange(value: string[]): void;
}
type Nullable<T> = T | null;

export const OTPInput = ({
  length,
  value,
  disabled,
  onChange,
}: OTPInputProps) => {
  const inputRefs = useRef<Array<Nullable<TextInput>>>([]);

  const onChangeValue = (text: string, index: number) => {
    const newValue = value.map((item, valueIndex) => {
      if (valueIndex === index) {
        return text;
      }

      return item;
    });

    onChange(newValue);
  };

  const handleChange = (text: string, index: number) => {
    onChangeValue(text, index);

    if (text.length !== 0) {
      return inputRefs?.current[index + 1]?.focus();
    }

    return inputRefs?.current[index - 1]?.focus();
  };

  const handleBackspace = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    const { nativeEvent } = event;

    if (nativeEvent.key === "Backspace") {
      handleChange("", index);
    }
  };

  return (
    <View>
      <Text style={[defaultStyles.header]}>
        Confirmation
      </Text>
      <Text style={[defaultStyles.smallTitle, {paddingVertical: 26}]}>
        Please check your email example@mail.com for a message with your code.
        Your code is 6 numbers long.
      </Text>
      <View style={{gap: 8}}>
        <Text style={{ color: Colors.dark300, fontSize: 16 }}>
          Enter the code
        </Text>
        <View style={styles.container}>
          {[...new Array(length)].map((item, index) => (
            <TextInput
              ref={(ref) => {
                if (ref && !inputRefs.current.includes(ref)) {
                  inputRefs.current = [...inputRefs.current, ref];
                }
              }}
              key={index}
              style={styles.input}
              maxLength={1}
              contextMenuHidden
             
              editable={!disabled}
              keyboardType="decimal-pad"
              testID={`OTPInput-${index}`}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(event) => handleBackspace(event, index)}
            />
          ))}
        </View>
        <Text style={{ color: Colors.dark300, fontSize: 19, paddingVertical: 16 }}>
          Didn't receive the code? Resend
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  input: {
    flex: 1,
    fontSize: 24,
    color: Colors.white,
    textAlign: "center",
    width: 45,
    height: 55,
    backgroundColor: Colors.dark500,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});
