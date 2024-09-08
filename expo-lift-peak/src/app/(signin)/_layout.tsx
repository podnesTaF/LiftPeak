import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
    screenOptions={{
      headerShown: false,
    }}
  >
      <Stack.Screen name="index"  />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
};

export default Layout;
