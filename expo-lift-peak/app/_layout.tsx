import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {Stack, useRouter, useSegments} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import {queryClient} from "@/config/QueryClient";
import {QueryClientProvider} from "@tanstack/react-query";
import {useAuthStore} from "@/store/auth";
import {Text} from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const {token} = useAuthStore();

  const router = useRouter();
  const segments = useSegments();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded ) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    const inAuthGroup = segments[0] === "(authenticated)";

    console.log('token', token);
    if (token && !inAuthGroup) {
      router.replace("/(authenticated)/(tabs)/index");
    } else if(!token) {
        router.replace("/login");
    }
  }, [token]);

  if (!loaded) {
    return <Text>Loading...</Text>;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
   <QueryClientProvider client={queryClient}>
     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
       <Stack>
         <Stack.Screen name="login"/>
         <Stack.Screen name="signup"  />
         <Stack.Screen name="(authenticated)/(tabs)" options={{ headerShown: false }} />
       </Stack>
     </ThemeProvider>
   </QueryClientProvider>
  );
}
