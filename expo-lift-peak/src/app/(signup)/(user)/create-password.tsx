import { useAuthStore } from "@features/auth";
import { register } from "@features/auth/api/authApi";
import Button from "@shared/components/Button";
import FormField from "@shared/components/form/FormField";
import { useToastStore } from "@shared/store";
import { defaultStyles, Colors } from "@shared/styles";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { FieldValues, useFormContext, useWatch } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  StyleSheet,
} from "react-native";

const CreatePassword = () => {
  const { watch, handleSubmit} = useFormContext();


  const password = watch("password", ""); 
  const passwordConfirmation = watch("passwordConfirmation", "");
  const username = watch("username", "");


  const passwordsMatch = password === passwordConfirmation;
  const isMinLengthPassword = password.length >= 6;
  const isMinLengthUsername = username.length >= 6; 
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);

  const isPasswordValid = isMinLengthPassword && hasUppercase && hasLowercase;
  const isUsernameValid = username.trim().length > 0;

  const { showToast } = useToastStore();
  const { user, setUser } = useAuthStore();

  const { mutate } = useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      username: string;
    }) => {
      const user = await register(data.email, data.password, data.username);
      setUser(user);
      router.push("/(authenticated)/(tabs)/home");
    },
    onSuccess: (data) => {
      showToast("User created successfully", "Success", "success");
    },
    onError: (error) => {
      showToast(
        "Registration Failed",
        "Please check your input and try again.",
        "error"
      );
    },
  });

  const handleCreateUser = (data: FieldValues) => {
    const userData = {
      email: data.email,
      password: data.password,
      username: data.username,
    };
    mutate(userData);
  };

  const isButtonDisabled =
    !isPasswordValid || !passwordsMatch || !isUsernameValid;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[defaultStyles.container]}
    >
      <View
        style={{
          flex: 1,
          gap: 6,
          paddingBottom: 40,
          marginTop: 38,
          marginHorizontal: 24,
        }}
      >
        <Text style={defaultStyles.header}>Create Password</Text>
        <View style={{ paddingVertical: 16, flex: 1, gap: 26 }}>
          <View style={{ gap: 24 }}>
            <View style={{ gap: 8 }}>
              <FormField
                type={"name"}
                name={"username"}
                placeholder={"enter your username"}
                noValidationStyling
              />
              <View style={styles.validationContainer}>
                <Text
                  style={[
                    styles.validationText,
                    isMinLengthUsername && styles.validationTextSuccess,
                  ]}
                >
                  ✓ Min 6 characters
                </Text>
              </View>
            </View>
            <View style={{ gap: 8 }}>
              <FormField
                type={"password"}
                name={"password"}
                placeholder={"enter your password"}
                noValidationStyling
                showPasswordToggle
              />

              <View style={styles.validationContainer}>
                <Text
                  style={[
                    styles.validationText,
                    isMinLengthPassword && styles.validationTextSuccess,
                  ]}
                >
                  ✓ Min 6 characters
                </Text>
                <Text
                  style={[
                    styles.validationText,
                    hasUppercase && styles.validationTextSuccess,
                  ]}
                >
                  ✓ Uppercase
                </Text>
                <Text
                  style={[
                    styles.validationText,
                    hasLowercase && styles.validationTextSuccess,
                  ]}
                >
                  ✓ Lowercase
                </Text>
              </View>
            </View>

            <View style={{gap: 10}}>
              <FormField
                type={"password"}
                name={"passwordConfirmation"}
                placeholder={"re-enter your password"}
                noValidationStyling
                showPasswordToggle
              />
              {!passwordsMatch && (
                <Text style={{ color: Colors.danger }}>
                  {"Passwords do not match"}
                </Text>
              )}
            </View>
          </View>

          <View>
            <Button
              disabled={isButtonDisabled}
              title={"Continue"}
              color={"dark100"}
              onPress={handleSubmit(handleCreateUser)}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  validationContainer: {
    flexDirection: "row",
    gap: 14,
  },
  validationText: {
    color: Colors.dark300,
    fontSize: 14,
  },
  validationTextSuccess: {
    color: Colors.success,
  },
});

export default CreatePassword;
