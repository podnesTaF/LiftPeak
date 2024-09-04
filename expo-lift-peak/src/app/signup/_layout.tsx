import { signupSchema } from "@features/auth/utils/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

const Layout = () => {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(signupSchema),
  });

  return (
    <FormProvider {...form}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
                <Stack.Screen name="index" />
        <Stack.Screen name="chooseGym" />


        <Stack.Screen name="signupOtp" />
        <Stack.Screen name="yourDetails" />
        <Stack.Screen name="createPassword" />
      </Stack>
    </FormProvider>
  );
};

export default Layout;
