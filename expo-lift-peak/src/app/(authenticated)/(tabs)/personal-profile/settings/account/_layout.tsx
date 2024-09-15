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
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="general"
        options={{
          title: "General",
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="select-gym"
        options={{
          title: "Select your home gym",
        }}
      />
      <Stack.Screen
        name="security"
        options={{
          title: "Security",
        }}
      />
    </Stack>
  );
};

export default Layout;
