import React from 'react';
import {Stack} from "expo-router";

const Layout = () => {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name={"(tabs)"}/>
            <Stack.Screen name={"notifications"} />
            <Stack.Screen name={"profile"} />
            <Stack.Screen name={"groups/[id]"} />
        </Stack>
    );
};

export default Layout;