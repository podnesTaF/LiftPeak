import { useAuthStore } from "@features/auth";
import { register } from "@features/auth/api/authApi";
import { UserRequest } from "@features/auth/utils/user.schema";
import Button from "@shared/components/Button";
import FormField from "@shared/components/form/formfield/FormField";
import { useToastStore } from "@shared/store";
import { defaultStyles, Colors } from "@shared/styles";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useFormContext } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  StyleSheet,
} from "react-native";

const CreatePassword = () => {
  const { watch, handleSubmit, formState } = useFormContext<UserRequest>();
  const { showToast } = useToastStore();
  const { setUser } = useAuthStore();

  const password = watch("password", "");
  const username = watch("username", "");
  const isMinLengthPassword = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = isMinLengthPassword && hasUppercase && hasLowercase;
  const isUsernameValid = !formState.errors.username && username.length >= 3;

  const mutation = useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      username: string;
    }) => {
      const user = await register(data.email, data.password, data.username);
      setUser(user);
      router.replace("/(signup)/(profile)/your-details");
    },
    onError: () => {
      showToast(
        "Registration Failed",
        "Please check your input and try again.",
        "error"
      );
    },
  });

  const handleCreateUser = (data: UserRequest) => {
    mutation.mutate(data);
  };

  const isButtonDisabled = !isUsernameValid || !isPasswordValid;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[defaultStyles.container]}
    >
      <View style={{ flex: 1, gap: 6, marginTop: 38, marginHorizontal: 24 }}>
        <Text style={[defaultStyles.header, { paddingBottom: 40 }]}>
          Account Setup
        </Text>
        <View style={{ paddingVertical: 16, flex: 1, gap: 26 }}>
          <View style={{ gap: 24 }}>
            <View style={{ gap: 8 }}>
              <FormField
                type="name"
                name="username"
                placeholder="Enter your username"
                label="Username"
              />

              {formState.errors.username && username.length >= 3 && (
                <Text style={{ color: Colors.danger }}>
                  {formState.errors.username?.message}
                </Text>
              )}
            </View>

            <View style={{ gap: 8 }}>
              <FormField
                type="password"
                name="password"
                placeholder="Enter your password"
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
          </View>

          <Button
            disabled={isButtonDisabled}
            title="Continue"
            color="dark100"
            onPress={handleSubmit(handleCreateUser)}
          />
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
