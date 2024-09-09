import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(user)" />
      <Stack.Screen name="(profile)" />
    </Stack>
  );
};

export default Layout;
