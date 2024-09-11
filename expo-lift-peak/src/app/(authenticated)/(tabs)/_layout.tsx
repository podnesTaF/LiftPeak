import React, { useState, useEffect } from "react";
import { Tabs, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomTabBar from "@shared/components/navigation/CustomTabBar";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons name={props.name} size={24} color={props.color} />;
}

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen
        name={"home"}
        options={{
          headerShown: false,
          tabBarIcon: (props) => (
            <TabBarIcon name="newspaper" color={props.color} />
          ),
        }}
      />
      <Tabs.Screen
        name={"start"}
        options={{
          title: "Start",
          headerShown: false,
          tabBarIcon: (props) => (
            <Ionicons size={36} name="add" color={props.color} />
          ),
        }}
      />
      <Tabs.Screen
        name={"personal-profile"}
        options={{
          title: "Profile",
          tabBarIcon: (props) => (
            <Ionicons size={36} name="person-outline" color={props.color} />
          ),
        }}
      />
    </Tabs>
  );
}
