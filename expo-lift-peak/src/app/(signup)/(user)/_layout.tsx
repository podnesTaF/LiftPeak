import { Ionicons } from "@expo/vector-icons";
import { UserRequest, userSchema } from "@features/auth/utils/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Colors } from "@shared/styles";
import { router, Stack } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { TouchableOpacity } from "react-native";

const Layout = () => {
  const form = useForm<UserRequest>({
    mode: "onChange",
    resolver: zodResolver(userSchema),
  });

  return (
    <FormProvider {...form}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.dark700,
          },
          headerTintColor: Colors.white,
          title: "",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="otp"
          options={{
            headerLeft: () => null,
            gestureEnabled: false,
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="create-password"
          options={{
            headerLeft: () => null,
            gestureEnabled: false,
            headerBackVisible: false,
          }}
        />
      </Stack>
    </FormProvider>
  );
};

export default Layout;
