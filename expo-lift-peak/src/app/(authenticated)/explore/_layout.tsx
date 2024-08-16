import React from 'react';
import {Stack} from "expo-router";
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Colors} from "@shared/styles";

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name={'index'} options={{
                title: "Explore Workouts",
                headerBackTitleVisible: false,
                headerTintColor: "white",
                headerStyle: {
                    backgroundColor: Colors.dark700
                },
                headerRight: () => (
                    <TouchableOpacity>
                        <Ionicons name={"search-outline"} size={32} color={"white"} />
                    </TouchableOpacity>
                )
            }} />
        </Stack>
    );
};

export default Layout;