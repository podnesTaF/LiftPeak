import React from 'react';
import {Stack} from "expo-router";

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name={'index'} />
            <Stack.Screen name={'generated'} />
        </Stack>
    );
};

export default Layout;