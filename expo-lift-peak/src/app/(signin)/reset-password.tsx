import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@shared/components/Button";
import FormField from "@shared/components/form/formfield/FormField";
import { defaultStyles, Colors } from "@shared/styles";
import {router, useLocalSearchParams} from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  StyleSheet,
} from "react-native";
import {useMutation} from "@tanstack/react-query";
import {resetPassword} from "@features/auth/api/authApi";
import {useToastStore} from "@shared/store";
import {useAuthStore} from "@features/auth";
import { PasswordRequest, passwordSchema } from "@features/auth/utils/password.schema";


const ResetPassword = () => {
  const { user, setUser } = useAuthStore();
  const {jwt} = useLocalSearchParams<{ jwt: string }>()

  const {showToast} = useToastStore()
  const form = useForm<PasswordRequest>({
    mode: "onChange",
    resolver: zodResolver(passwordSchema),
  });

  const {mutate} = useMutation({
    mutationFn: async (props: {password:string, jwt:string}) => resetPassword(props),
    onSuccess: (res) => {
      setUser(res)
      showToast("Password reset successfully", `Logged in as ${res.username}`, "success")
      router.push({pathname: "/(authenticated)/(tabs)/home"})
    },
    onError: () => {
      showToast("Error resetting password", "There an error occurs while resetting the password", "error")
    }
  })


  const handleResetPassword = (dto: PasswordRequest) => {
    if(!jwt) {
     return
    }

    mutate({password: dto.password2, jwt: jwt})
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[defaultStyles.container]}
    >
      <View style={{ flex: 1, gap: 46, paddingBottom: 40, marginTop: 38, marginHorizontal: 24 }}>
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
                      // isMinLength && styles.validationTextSuccess,
                    ]}
                  >
                    ✓ Min 6 characters
                  </Text>
                  <Text
                    style={[
                      styles.validationText,
                      // Boolean(hasUppercase) && styles.validationTextSuccess,
                    ]}
                  >
                    ✓ Uppercase
                  </Text>
                  <Text
                    style={[
                      styles.validationText,
                      // Boolean(hasLowercase) && styles.validationTextSuccess,
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
                onPress={form.handleSubmit(handleResetPassword)}
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
