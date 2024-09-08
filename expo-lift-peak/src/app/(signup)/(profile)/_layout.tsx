import { ProfileRequest, profileSchema } from "@features/auth/utils/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

const Layout = () => {
    const form = useForm<ProfileRequest>({
      mode: "onChange",
      resolver: zodResolver(profileSchema),
    });
  
    return (
      <FormProvider {...form}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="choose-gym" />
          <Stack.Screen name="your-details" />
        </Stack>
        
      </FormProvider>
    );
  };

export default Layout;