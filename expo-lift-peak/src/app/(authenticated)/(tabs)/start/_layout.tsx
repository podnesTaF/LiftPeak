import React from 'react';
import {Stack} from "expo-router";

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name={"index"} options={{
                title: "Start Index"
            }} />
            <Stack.Screen name={"workout"} options={{
                headerShown: false,
                title: "Index Page"
            }} />
        </Stack>
    );
};

export default Layout;