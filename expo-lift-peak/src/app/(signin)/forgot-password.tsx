import {
  EmailOnlyRequest,
  emailSchema,
} from "@features/auth/utils/email.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@shared/components/Button";
import FormField from "@shared/components/form/formfield/FormField";
import { Colors, defaultStyles } from "@shared/styles";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { resetRequest } from "@features/auth/api/authApi";
import { useToastStore } from "@shared/store";
import { useAuthStore } from "@features/auth";
import { AxiosError } from "axios";

const ForgotPassword = () => {
  const form = useForm<EmailOnlyRequest>({
    mode: "onChange",
    resolver: zodResolver(emailSchema),
  });

  const { showToast } = useToastStore();

  const { mutate } = useMutation({
    mutationFn: async (data: EmailOnlyRequest) => resetRequest(data),
    onSuccess: () => {
      router.push({
        pathname: "/(signin)/otp",
        params: { email: form.getValues().email },
      });
      console.log("success");
    },
    onError: (e) => {
      if ((e as AxiosError).response && (e as AxiosError).response!.status === 400) {
        showToast(
          "Password Reset Failed",
          "The email you entered does not exist. Please check and try again.",
          "error"
        );
      } else {
        showToast(
          "Password Reset Failed",
          "There was an error processing your request. Please try again later.",
          "error"
        );
      }
    }
  });

  const navigateOtp = (dto: EmailOnlyRequest) => {
    mutate(dto);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[defaultStyles.container]}
    >
      <View
        style={{
          paddingBottom: 40,
          marginTop: 38,
          gap: 20,
          marginHorizontal: 24,
        }}
      >
        <Text style={defaultStyles.header}>Forgot password</Text>
        <Text style={{ color: Colors.dark300, fontSize: 16 }}>
          Please enter your email to reset the password
        </Text>

        <View>
          <FormProvider {...form}>
            <View style={{ gap: 30 }}>
              <FormField
                type="emailAddress"
                name="email"
                label="Email"
                placeholder="enter your email"
              />
              <Button
                disabled={!form.formState.isValid}
                title={"Recover Password"}
                color={"dark100"}
                onPress={form.handleSubmit(navigateOtp)}
              />
            </View>
          </FormProvider>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
