import Button from "@shared/components/Button";
import FormField from "@shared/components/form/FormField";
import { defaultStyles } from "@shared/styles";
import { router } from "expo-router";
import { useFormContext, useWatch } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

const Signup = () => {
  const { formState, trigger} = useFormContext(); 
  const emailError = formState.errors.email;


  const emailValue = useWatch({
    name: "email"
  })

  const handleOtp = async () => {
    const isValid = await trigger("email"); 

    if (isValid) {
      router.push({pathname: "/(signup)/(user)/otp", params: {email: emailValue}});
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
            <FormField
              type="emailAddress"
              name="email"
              label="Email"
              placeholder="enter your email"
            />
            <Button
              disabled={!emailValue || !!emailError} 
              title={"Continue"}
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
