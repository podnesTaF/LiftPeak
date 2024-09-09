import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import { Colors } from "@shared/styles";
import { Ionicons } from "@expo/vector-icons";

const Layout = () => {
  return (
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
      <Stack.Screen name="index" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
};

export default Layout;
