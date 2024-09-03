import {
  PasswordOnlyRequest,
  passwordSchema,
} from "@features/auth/utils/passwordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@shared/components/Button";
import FormField from "@shared/components/form/FormField";
import { useToastStore } from "@shared/store";
import { defaultStyles, Colors } from "@shared/styles";
import { router } from "expo-router";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  StyleSheet,
} from "react-native";

interface PasswordProps {
  onPress?: () => void;
  isReset?: boolean;
  passwordValid?: boolean;
}

const PasswordSetupForm: React.FC<PasswordProps> = ({
  onPress = () => {},
  isReset = false,
  passwordValid = false,
}) => {

  const { formState, watch } = useFormContext();

  const password1 = watch("password1");
  const password2 = watch("password2");
  const passwordsMatch = password1 === password2;

  const isMinLength = password1?.length >= 6;
  const hasUppercase = password1 && /[A-Z]/.test(password1);
  const hasLowercase = password1 && /[a-z]/.test(password1);

  const { showToast } = useToastStore();

  const handlePassword = () => {
    showToast(
      "Success",
      "Your password has been reset successfully!",
      "success",
      2000
    );

    setTimeout(() => {
      onPress();
    }, 2000);
  };

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
        <Text style={defaultStyles.header}>
          {isReset ? "Reset Password" : "Create Password"}
        </Text>
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
              {!passwordsMatch &&
                password2 !== "" &&
                password2 !== undefined && (
                  <Text style={{ color: "red" }}>Passwords do not match </Text>
                )}
            </View>
          </View>

          <View style={{}}>
            <Button
              disabled={!passwordValid || !passwordsMatch}
              title={"Continue"}
              color={"dark100"}
              onPress={isReset ? handlePassword : onPress}
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

export default PasswordSetupForm;
