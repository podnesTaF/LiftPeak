import React from 'react';
import {Stack, useRouter} from "expo-router";
import {Colors} from "@shared/styles";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";

const Layout = () => {
    const router = useRouter();
    return (
        <Stack>
            <Stack.Screen name={'index'} options={{
                headerStyle: {
                    backgroundColor: Colors.dark700
                },
                presentation: "modal",
                headerLeft: () => (
                    <TouchableOpacity onPress={router.back}>
                        <Ionicons name={'chevron-back'} size={30} color={Colors.white} />
                    </TouchableOpacity>
                ),
                headerTintColor: Colors.white,
                headerTitle: "Muscle Filter",
                headerShadowVisible: false
            }} />
        </Stack>
    );
};

export default Layout;