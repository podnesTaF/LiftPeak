import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { loginSchema, LoginRequest, useAuthStore } from "@features/auth";
import { Colors, defaultStyles } from "@shared/styles";
import FormField from "@shared/components/form/FormField";
import Button from "@shared/components/Button";
import { useToastStore } from "@shared/store";
import { login } from "@features/auth/api/authApi";



const Login = () => {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const {showToast} = useToastStore()
  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const user = await login(data.email, data.password);
      setUser(user);
      router.push("/(authenticated)/(tabs)/home");
    },
    onError: (error) => {
      console.log(error);
      showToast("Login Failed", "The email or password you entered is incorrect. Please try again.", "error");
    },
  });

  const form = useForm<LoginRequest>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    mutation.mutate(data);
  };


  useFocusEffect(
    React.useCallback(() => {
      form.reset();
    }, [])
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[defaultStyles.container]}
    >
      <View style={{ flex: 1, gap: 16, paddingBottom: 70, marginTop: 38, marginHorizontal: 24 }}>
        <Text style={defaultStyles.header}>Log in</Text>
        <FormProvider {...form}>
          <View style={{ paddingVertical: 16, flex: 1, gap: 26 }}>
            <View style={{ gap: 20 }}>
              <FormField
                type={"emailAddress"}
                name={"email"}
                label={"Email"}
                placeholder={"enter your email"}
                noValidationStyling           
              />
              <FormField
                type={"password"}
                name={"password"}
                label={"Password"}
                placeholder={"enter your password"}
                noValidationStyling
                showPasswordToggle
              />
            </View>
            <Link href={"forgot-password"} asChild>
              <TouchableOpacity>
                <Text style={{ color: Colors.lime, fontSize: 16 }}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View style={{ gap: 24 }}>
            <Button
              disabled={!form.formState.isValid}
              title={"Login"}
              color={"dark100"}
              onPress={form.handleSubmit(onSubmit)}
            />
            <View style={defaultStyles.horizontalContainer}>
              <Text style={{ color: "white", fontSize: 16 }}>
                Don't have an account?
              </Text>
              <Link href={"/"} asChild>
                <TouchableOpacity>
                  <Text style={{ color: Colors.lime, fontSize: 16 }}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </FormProvider>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
