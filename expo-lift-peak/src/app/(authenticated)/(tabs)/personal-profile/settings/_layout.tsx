import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@shared/styles";

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
        name="index"
        options={{
          title: "Settings",
          
        }}
      />
      <Stack.Screen name="account" options={{headerShown: false}}/>
      <Stack.Screen name="workout" options={{headerShown: false}}/>

    </Stack>
  );
};

export default Layout;
