import React from 'react';
import {Stack} from "expo-router";
import {Colors} from "@shared/styles";
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name={"index"} options={{
                title: "Start a workout",
            }} />
        </Stack>
    );
};

export default Layout;