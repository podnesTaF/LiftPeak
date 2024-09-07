import React, {useEffect, useState} from 'react';
import {Text, View} from "react-native";
import {useExerciseStore, useWorkout} from "@features/workout-logger";
import {Colors, defaultStyles} from "@shared/styles";
import Button from "@shared/components/Button";
import {useRestStore} from "@features/timer/store/restTimeStore";
import {formatTime} from "@shared/utils";
import {useRouter} from "expo-router";

const BottomControl = () => {
    const { isResting, restDuration, setRestTimer, completeRest, restStartTime } = useRestStore();
    const {getCurrentExercise, getExerciseSetsStats,updateSet } = useExerciseStore()
    const exerciseLog = getCurrentExercise();
    const stats = exerciseLog && getExerciseSetsStats(exerciseLog.id);
    const currentSet = exerciseLog?.sets?.find(set => !set.completed);
    const [displayedRestTime, setDisplayedRestTime] = useState(0);
    const router = useRouter()

    const completeSet = () => {
        if (currentSet) {
            updateSet(exerciseLog!.id, { ...currentSet, completed: true });

            if (currentSet.restInS) {
                const currentRestDuration = currentSet.restInS;
                const currentTime = Date.now();
                setRestTimer(currentRestDuration);
                const remainingTime = currentRestDuration - Math.floor((currentTime - currentTime) / 1000);
                setDisplayedRestTime(remainingTime);
            }
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isResting && restDuration !== null && restStartTime) {
            // Update the displayed time every second
            interval = setInterval(() => {
                const elapsedTime = Math.floor((Date.now() - restStartTime) / 1000); // Time in seconds
                const remainingTime = restDuration - elapsedTime;

                if (remainingTime <= 0) {
                    // When the rest time is over, stop the timer and complete the rest
                    setDisplayedRestTime(0);
                    completeRest();
                } else {
                    setDisplayedRestTime(remainingTime);
                }
            }, 1000);

            const elapsedTime = Math.floor((Date.now() - restStartTime) / 1000);
            const remainingTime = restDuration - elapsedTime;
            setDisplayedRestTime(remainingTime);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isResting, restDuration, restStartTime, completeRest]);


    return (
        <View style={{paddingTop: 12, backgroundColor: Colors.dark700, paddingBottom: 20, paddingHorizontal: 12}}>
            {exerciseLog?.exercise?.name &&<Text style={[defaultStyles.smallTitle, {fontSize: 14}]}>
                {exerciseLog.exercise.name}
            </Text>}
            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, alignItems: 'center'}}>
                {stats && <Text style={{color: Colors.success, fontWeight: "600"}}>
                    {stats.setsDone} / {stats.totalSets} Sets
                </Text>}
                {isResting && restDuration !== null ? (
                    <Text style={{ color: Colors.dark300, fontWeight: '600' }}>
                        Rest: {formatTime(displayedRestTime)}
                    </Text>
                ) : (
                    currentSet && (
                        <Text style={{ color: Colors.dark300, fontWeight: '600' }}>
                            {currentSet.reps} x {currentSet.weight}
                        </Text>
                    )
                )}
                {isResting ? (
                    <Button color={'white'} title={"Skip Rest"} onPress={() => completeRest()} />
                ) : currentSet ? (
                    <Button color={"white"} onPress={completeSet} title={"Complete Set"} />
                ) : (
                    <Button color={"white"} onPress={() => router.push("/(authenticated)/workout/workout-save")} title={"Complete Workout"} />
                )}
            </View>
        </View>
    );
};

export default BottomControl;