import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="index"  />
      <Stack.Screen name="signupOtp" />
      <Stack.Screen name="createPassword" />
      <Stack.Screen name="yourDetails" />
      {/* <Stack.Screen name="yourGym" /> */}
    </Stack>
  );
};

export default Layout;
