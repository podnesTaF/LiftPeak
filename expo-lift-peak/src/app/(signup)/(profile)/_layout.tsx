import { Ionicons } from "@expo/vector-icons";
import {
  ProfileRequest,
  profileSchema,
} from "@features/auth/utils/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Colors } from "@shared/styles";
import { router, Stack } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";

const Layout = () => {
  const form = useForm<ProfileRequest>({
    mode: "onChange",
    resolver: zodResolver(profileSchema),
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
        }}
      >
        <Stack.Screen
          name="your-details"
          options={{
            headerLeft: () => null,
            gestureEnabled: false,
            headerBackVisible: false,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => router.push("/(signup)/(profile)/choose-gym")}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: "400",
                    }}
                  >
                    Skip
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={Colors.white}
                    style={{ marginLeft: 5 }}
                  />
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="choose-gym"
          options={{
            headerLeft: () => null,
            headerBackVisible: false,
          }}
        />
      </Stack>
    </FormProvider>
  );
};

export default Layout;
