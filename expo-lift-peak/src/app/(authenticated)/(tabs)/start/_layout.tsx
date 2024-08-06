import React from 'react';
import {Stack} from "expo-router";

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name={"index"} options={{
                title: "Start Workout"
            }} />
            <Stack.Screen name={"workout"} options={{
                title: "Workout Page"
            }} />
        </Stack>
    );
};

export default Layout;