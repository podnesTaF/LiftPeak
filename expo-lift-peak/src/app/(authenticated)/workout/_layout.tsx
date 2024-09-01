import React from 'react';
import {Stack} from "expo-router";

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="exercises" />
        </Stack>
    );
};

export default Layout;