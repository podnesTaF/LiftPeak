import {
  EmailOnlyRequest,
  emailSchema,
} from "@features/auth/utils/emailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@shared/components/Button";
import FormField from "@shared/components/form/FormField";
import { Colors, defaultStyles } from "@shared/styles";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

const ForgotPassword = () => {
  const form = useForm<EmailOnlyRequest>({
    mode: "onChange",
    resolver: zodResolver(emailSchema),
  });

  const navigateOtp = () => {
    router.navigate('otp')
  }

  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[defaultStyles.container]}
    >
      <View style={{ paddingBottom: 40, marginTop: 38, gap: 20 }}>
        <Text style={defaultStyles.header}>Forgot password</Text>
        <Text style={{ color: Colors.dark300, fontSize: 16 }}>
          Please enter your email to reset the password
        </Text>
      </View>
      <View>
        <FormProvider {...form}>
          <View style={{gap: 30}}>
            <FormField
              type="emailAddress"
              name="email"
              label="Email"
              placeholder="enter your email"
            />
            <Button
              disabled={!form.formState.isValid}
              title={"Reset Password"}
              color={"dark100"}
              onPress={navigateOtp}
            />

            
          </View>
        </FormProvider>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
