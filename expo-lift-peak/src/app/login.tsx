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
import { Link, useRouter } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { loginSchema, LoginUserRequest, useAuthStore } from "@features/auth";
import { IUser } from "@entities/user";
import api from "@shared/api/AxiosInstance";
import { Colors, defaultStyles } from "@shared/styles";
import FormField from "@shared/components/form/FormField";
import Button from "@shared/components/Button";

async function login(email: string, password: string) {
  const { data } = await api.post<IUser & { expiresAt: number }>(
    "/auth/login",
    { email, password }
  );
  return data;
}

const Login = () => {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const user = await login(data.email, data.password);
      setUser(user);
      router.push("/(authenticated)/(tabs)/home");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const form = useForm<LoginUserRequest>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginUserRequest) => {
    mutation.mutate(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[defaultStyles.container]}
    >
      <View style={{ flex: 1, gap: 16, paddingBottom: 40, marginTop: 38 }}>
        <Text style={defaultStyles.header}>Login</Text>
        <FormProvider {...form}>
          <View style={{ paddingVertical: 16, flex: 1, gap: 26 }}>
            <View style={{ gap: 20 }}>
              <FormField
                type={"emailAddress"}
                name={"email"}
                label={"Email"}
                placeholder={"enter your email"}
              />
              <FormField
                type={"password"}
                name={"password"}
                label={"Password"}
                placeholder={"enter your password"}
              />
            </View>
            <Link href={"/forgotPassword"} asChild>
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
