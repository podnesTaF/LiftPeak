import { UserRequest, userSchema } from "@features/auth/utils/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

const Layout = () => {
    const form = useForm<UserRequest>({
      mode: "onChange",
      resolver: zodResolver(userSchema),
    });
  
    return (
      <FormProvider {...form}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" options={{title: ''}}/>
          <Stack.Screen name="otp" />
          <Stack.Screen name="create-password" />
        </Stack>
        
      </FormProvider>
    );
  };

  export default Layout;