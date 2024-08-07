import React, {useEffect} from 'react';
import {ScrollView, View} from "react-native";
import {defaultStyles} from "@shared/styles";
import {ExerciseItem, useExerciseStore, useWorkoutStore} from "@features/workout-logger";
import {useAuthStore} from "@features/auth";
import Button from "@shared/components/Button";
import {Link, useRouter} from "expo-router";

const Index = () => {
    const {workout, workoutLog, setWorkout, setWorkoutLog} = useWorkoutStore();
    const {user} = useAuthStore()
    const {exerciseLogs, getExerciseById} = useExerciseStore();
    const router = useRouter();


    useEffect(() => {
        if (!workout || !workoutLog) {
            const {id} = setWorkout({
                title: "Test Index",
                description: "This is a test workout",
                userId: user!.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            setWorkoutLog({
                baseWorkoutId: id,
                startTime: new Date().toISOString(),
                totalVolume: 0,
                totalDistanceInM: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }
    }, [workout, workoutLog]);


    const openExerciseLog = (exerciseLogId: number | string) => {

        router.push({
            pathname: "/(authenticated)/(tabs)/start/workout/exercise-log",
            params: {
                id: exerciseLogId
            }
        });
    }

    return (
        <ScrollView contentContainerStyle={[defaultStyles.container, {justifyContent: "center", alignItems: "center"}]}>
            <View style={{flex: 1}}>
                {exerciseLogs.map(exerciseLog => (
                    <ExerciseItem onPress={openExerciseLog} key={exerciseLog.id} exerciseLog={exerciseLog}/>
                ))}
            </View>
            <Link href={"/(authenticated)/(tabs)/start/workout/exercises"} asChild>
                <Button title={"Add Exercise"} color={"lime"}/>
            </Link>
        </ScrollView>
    );
};

export default Index;