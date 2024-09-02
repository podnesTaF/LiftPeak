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
  
  const Signup = () => {
    const form = useForm<EmailOnlyRequest>({
      mode: "onChange",
      resolver: zodResolver(emailSchema),
    });
  
    const handleOtp = () => {
      router.push("/signup/signupOtp")
    }
  
    return (  
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[defaultStyles.container]}
      >
        <View style={{ marginHorizontal: 24, marginTop: 38 }}>
          <View style={{ paddingBottom: 40}}>
            <Text style={defaultStyles.header}>Sign Up</Text>
          </View>
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
                  title={"Continue"}
                  color={"dark100"}
                  onPress={handleOtp}
                />
              </View>
            </FormProvider>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };
  
  export default Signup;
  