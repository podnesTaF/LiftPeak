import React from 'react';
import {Stack} from "expo-router";
import {WorkoutProvider} from "@features/workout/store/workoutContext";

const Layout = () => {
    return (
        <WorkoutProvider mode={"workout"}>
            <Stack>
                <Stack.Screen name="index" />
                <Stack.Screen name="exercises" />
            </Stack>
        </WorkoutProvider>
    );
};

export default Layout;