import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
        <Tabs.Screen name={"index"} />
        <Tabs.Screen name={"two"} />
        <Tabs.Screen name={"logout"} options={{
            headerShown: true,
            headerTransparent: true
        }} />
    </Tabs>
  );
}
