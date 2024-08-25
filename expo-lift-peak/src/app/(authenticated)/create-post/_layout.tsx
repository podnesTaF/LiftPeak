import React from 'react';
import {Stack, useRouter} from "expo-router";
import {Colors} from "@shared/styles";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";

const Layout = () => {
    const router = useRouter();
    return (
        <Stack>
            <Stack.Screen name={"index"} options={{
                headerStyle: {
                    backgroundColor: Colors.dark700,
                },
                headerTintColor: Colors.white,
                headerTitle: "Create Post",
                headerBackTitleVisible: false,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name={"close"} size={32} color={Colors.dark300} />
                    </TouchableOpacity>
                )
            }}/>
        </Stack>
    );
};

export default Layout;