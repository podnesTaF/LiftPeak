import React, { useState } from "react";
import { OTPInput } from "@features/auth/ui";
import {
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import Button from "@shared/components/Button";
import { Colors, defaultStyles } from "@shared/styles";

const Otp = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill("")); // Assuming the OTP length is 6

  const handleOtpChange = (newOtp: string[]) => {
    setOtp(newOtp);
  };

  const handleSubmit = () => {
    // You can handle OTP submission here, e.g., send it to the backend or validate it
    Alert.alert("OTP Entered", otp.join(""));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "position"}
      style={[defaultStyles.container]}
    >
      <View style={{ gap: 16, paddingBottom: 40, marginTop: 38 }}>
        <OTPInput
          length={6}
          value={otp}
          disabled={false}
          onChange={handleOtpChange}
        />
        <Button
          disabled={true}
          title={"Confirm"}
          color={"dark100"}
          onPress={handleSubmit}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Otp;
