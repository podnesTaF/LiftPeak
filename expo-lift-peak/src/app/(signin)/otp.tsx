import React, { useEffect, useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Button from "@shared/components/Button";
import { Colors, defaultStyles } from "@shared/styles";
import { OtpInput } from "react-native-otp-entry";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { validateOtp } from "@features/auth/api/authApi";
import { useToastStore } from "@shared/store";

const Otp = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const { showToast } = useToastStore();
  const isOtpComplete = otp.length === 6;

  const { mutate } = useMutation({
    mutationFn: validateOtp,
    onSuccess: (res) => {
      if (res) {
        router.push({
          pathname: "/(signin)/reset-password",
          params: { jwt: res },
        });
        return;
      }
      showToast(
        "error validating the code",
        "You entered the wrong code, please try again",
        "error"
      );
    },
    onError: () => {
      showToast(
        "Error validating the code",
        "The code is expired. Please enter new.",
        "error"
      );
    },
  });

  const handleResetPassword = () => {
    if (!isOtpComplete || !email) {
      return;
    }
    mutate({ otp, email });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "position"}
      style={[defaultStyles.container]}
    >
      <View style={{ marginTop: 38, marginHorizontal: 24 }}>
        <Text style={[defaultStyles.header]}>Confirmation</Text>
        <Text style={[defaultStyles.smallTitle, { paddingVertical: 26 }]}>
          Enter Verification code
        </Text>

        <View style={{ paddingBottom: 40 }}>
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => {
              setOtp(text);
            }}
            focusColor={Colors.white}
            focusStickBlinkingDuration={400}
            disabled={false}
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: Colors.dark500,
                width: 59,
                height: 59,
                borderRadius: 12,
                borderColor: Colors.dark500,
              },
              pinCodeTextStyle: {
                color: Colors.white,
              },
            }}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[defaultStyles.secondaryText, { fontSize: 16 }]}>
            Don't receive the code?
          </Text>
          <TouchableOpacity>
            <Text
              style={[
                defaultStyles.secondaryText,
                { fontSize: 16, color: Colors.lime },
              ]}
            >
              {" "}
              Resend
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 64 }}>
          <Button
            title={"Verify and Proceed"}
            color={"white"}
            onPress={handleResetPassword}
            disabled={!isOtpComplete}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Otp;

const styles = StyleSheet.create({});
