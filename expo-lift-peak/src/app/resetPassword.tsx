import {
  PasswordOnlyRequest,
  passwordSchema,
} from "@features/auth/utils/passwordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@shared/components/Button";
import FormField from "@shared/components/form/FormField";
import { defaultStyles, Colors } from "@shared/styles";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  StyleSheet,
  Alert,
} from "react-native";

const ResetPassword = () => {
  const form = useForm<PasswordOnlyRequest>({
    mode: "onChange",
    resolver: zodResolver(passwordSchema),
  });

  const password1 = form.watch("password1");

  const isMinLength = password1?.length >= 6;
  const hasUppercase = password1 && /[A-Z]/.test(password1);
  const hasLowercase = password1 && /[a-z]/.test(password1);

  const handleResetPassword = () => {
    Alert.alert("Success", "Your password has been changed.",
        [
            {
                text: "Back to Main Menu",
                onPress: () => router.replace('/')
            },
        ],
        {cancelable: false}
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[defaultStyles.container]}
    >
      <View style={{ flex: 1, gap: 46, paddingBottom: 40, marginTop: 38 }}>
        <Text style={defaultStyles.header}>Reset Password</Text>
        <FormProvider {...form}>
          <View style={{ paddingVertical: 16, flex: 1, gap: 26 }}>
            <View style={{ gap: 24 }}>
              <View style={{ gap: 6 }}>
                <FormField
                  type={"password"}
                  name={"password1"}
                  placeholder={"enter your password"}
                  noValidationStyling
                  showPasswordToggle
                />
                <View style={styles.validationContainer}>
                  <Text
                    style={[
                      styles.validationText,
                      isMinLength && styles.validationTextSuccess,
                    ]}
                  >
                    ✓ Min 6 characters
                  </Text>
                  <Text
                    style={[
                      styles.validationText,
                      Boolean(hasUppercase) && styles.validationTextSuccess,
                    ]}
                  >
                    ✓ Uppercase
                  </Text>
                  <Text
                    style={[
                      styles.validationText,
                      Boolean(hasLowercase) && styles.validationTextSuccess,
                    ]}
                  >
                    ✓ Lowercase
                  </Text>
                </View>
              </View>

              <View style={{ gap: 6 }}>
                <FormField
                  type={"password"}
                  name={"password2"}
                  placeholder={"re-enter your password"}
                  noValidationStyling
                  showPasswordToggle
                />
                {form.formState.errors.password2 && (
                  <Text style={{ color: "red" }}>
                    {form.formState.errors.password2.message}
                  </Text>
                )}
              </View>
            </View>

            <View style={{}}>
              <Button
                disabled={!form.formState.isValid}
                title={"Continue"}
                color={"dark100"}
                onPress={handleResetPassword}
              />
            </View>
          </View>
        </FormProvider>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  validationContainer: {
    flexDirection: "row",
    gap: 14,
    // paddingVertical: 1,
  },
  validationText: {
    color: Colors.dark300,
    fontSize: 14,
  },
  validationTextSuccess: {
    color: Colors.success,
  },
});

export default ResetPassword;
