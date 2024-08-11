import FontAwesome from '@expo/vector-icons/FontAwesome';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack, useRouter, useSegments} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, {useEffect} from 'react';
import 'react-native-reanimated';

import {QueryClientProvider} from "@tanstack/react-query";
import {Text, TouchableOpacity} from "react-native";
import {StatusBar} from "expo-status-bar";
import {Ionicons} from "@expo/vector-icons";
import {useAuthStore} from "@features/auth";
import {Colors, useColorScheme} from "@shared/styles";
import {queryClient} from "@shared/api";
import {AnimatedScrollProvider} from "@shared/components/AnimatedScrollContext";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import ToastNotification from "@shared/components/ToastNotification";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: '(top-tabs)',
};


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
    const [loaded, error] = useFonts({
        SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    const {token,isTokenValid, clearAuth} = useAuthStore();

    const router = useRouter();
    const segments = useSegments();

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    useEffect(() => {
        if (!loaded) {
            return;
        }
        if (!isTokenValid()) {
            clearAuth();
            router.replace("/login");
        }
    }, [loaded, token]);

    useEffect(() => {
        if (!loaded) {
            return;
        }
        const inAuthGroup = segments[0] === "(authenticated)";

        if (token && !inAuthGroup) {
            router.replace("/(authenticated)/(tabs)/home");
        } else if (!token) {
            router.replace("/");
        }
    }, [token, loaded]);

    if (!loaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <Stack screenOptions={{
            headerStyle: {
                backgroundColor: Colors.dark700,
            },
            headerTintColor: Colors.white,
        }}>
            <Stack.Screen name={'index'} options={{headerShown: false, title: ''}}/>
            <Stack.Screen name="login" options={{
                title: "",
            }}/>
            <Stack.Screen name="forgotPassword" options={{
                title: "",
                
            }}/>
            <Stack.Screen name="signup"/>
            <Stack.Screen name="(authenticated)/(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="(authenticated)/search" options={{
                headerShown: true,
                title: "Search",
                headerBackTitleVisible: false,
                
            }}/>
        </Stack>
    );
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <AnimatedScrollProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                        <StatusBar style="light"/>
                        <InitialLayout/>
                        <ToastNotification />
                </GestureHandlerRootView>
                </AnimatedScrollProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default RootLayoutNav;
