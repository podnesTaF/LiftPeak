import { checkIfUserExists } from "@features/auth/api/authApi";
import Button from "@shared/components/Button";
import FormField from "@shared/components/form/formfield/FormField";
import { useToastStore } from "@shared/store";
import { Colors, defaultStyles } from "@shared/styles";
import { useMutation } from "@tanstack/react-query";
import { exists } from "drizzle-orm";
import { router } from "expo-router";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

const Signup = () => {
  const { formState, trigger, setValue } = useFormContext();
  const { showToast } = useToastStore();
  const emailError = formState.errors.email;
  const emailValue = useWatch({
    name: "email",
  });

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const exists = await checkIfUserExists(email, "email");
      return exists ?? false;
    },
    onSuccess: (exists: boolean) => {
      if (exists) {
        showToast(
          "Email Exists",
          "This email is already in use. Please try another one.",
          "error"
        );

        setValue("email", "");
      } else {
        router.push({
          pathname: "/(signup)/(user)/otp",
          params: { email: emailValue },
        });
      }
    },
    onError: () => {
      showToast(
        "Error",
        "An error occurred while checking the email.",
        "error"
      );
    },
  });

  const handleOtp = async () => {
    const isValid = await trigger("email");

    if (isValid && emailValue) {
      mutation.mutate(emailValue);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[defaultStyles.container]}
    >
      <View style={{ marginHorizontal: 24, marginTop: 38 }}>
        <View style={{ paddingBottom: 40 }}>
          <Text style={defaultStyles.header}>Sign Up</Text>
        </View>
        <View>
          <View style={{ gap: 30 }}>
            <View>
              <FormField
                type="emailAddress"
                name="email"
                label="Email"
                placeholder="enter your email"
              />
            </View>

            <Button
              disabled={!emailValue || !!emailError || mutation.isPending}
              title={mutation.isPending ? "Checking..." : "Continue"}
              color={"dark100"}
              onPress={handleOtp}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Signup;
