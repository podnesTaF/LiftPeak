import React, {useEffect} from 'react';
import {View} from "react-native";
import {defaultStyles} from "@shared/styles";
import {useWorkoutStore} from "@features/workout-logger";
import {useAuthStore} from "@features/auth";

const Workout = () => {
    const {workout, workoutLog, setWorkout, setWorkoutLog } = useWorkoutStore();
    const {user} = useAuthStore()


    useEffect(() => {
        if (!workout) {
            setWorkout({
                title: "Test Workout",
                description: "This is a test workout",
                userId: user!.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            setWorkoutLog({

            });
        }
    }, []);

    return (
        <View style={[defaultStyles.container, {justifyContent: "center", alignItems: "center"}]}>

        </View>
    );
};

export default Workout;