import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Dimensions} from "react-native";
import {Colors} from "@shared/styles";
import {Ionicons} from "@expo/vector-icons";
import {useWorkoutStore} from "../store";
import {useDiscardWorkout} from '../hooks'
import {useTimerStore} from "@features/timer";
import {useRouter} from "expo-router";
import {formatTime} from "@shared/utils";
import useTimerInterval from "@features/timer/hooks/useIntervalTimer";

export const ActiveWorkoutPopup = () => {
    const {workout} = useWorkoutStore();
    const {elapsedTime, pauseTimer, playTimer, isRunning} = useTimerStore();
    const  {discardAlert} = useDiscardWorkout();
    const router = useRouter();
    const width = Dimensions.get("window").width;

    useTimerInterval();

    if(!workout) {
        return null
    }

    const navigateToWorkout = () => {
        router.push("/(authenticated)/workout")
    }

    return (
        <View style={[styles.container, {width: width - 20}]}>
            <View style={styles.row}>
                <Text style={{color: Colors.success, fontWeight: "600", fontSize: 16}}>
                    {formatTime(elapsedTime)}
                </Text>
                {isRunning ? (
                    <TouchableOpacity onPress={pauseTimer} style={[styles.actionContainer, {position: "absolute", left: "50%", transform: [{ translateX: -35 }] }]}>
                        <Ionicons name={"pause-circle"} size={24} color={Colors.dark300} />
                        <Text style={{color: Colors.dark300, fontWeight: "600", fontSize: 16}}>
                            Pause
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={playTimer} style={[styles.actionContainer, {position: "absolute", left: "50%", transform: [{ translateX: -35 }] }]}>
                        <Ionicons name={"play-circle"} size={24} color={Colors.dark300} />
                        <Text style={{color: Colors.dark300, fontWeight: "600", fontSize: 16}}>
                            Play
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.row}>
                <TouchableOpacity onPress={navigateToWorkout} style={[styles.actionContainer]}>
                    <Ionicons name={"return-up-back"} size={24} color={Colors.white} />
                    <Text style={{color: Colors.white, fontWeight: "600", fontSize: 16}}>
                        Workout
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={discardAlert} style={[styles.actionContainer]}>
                    <Ionicons name={"close-outline"} size={24} color={Colors.danger} />
                    <Text style={{color: Colors.danger, fontWeight: "600", fontSize: 16}}>
                        Discard
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(0,0,0,0.85)",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 10,
        gap: 16,
        position: "absolute",
        bottom: 90,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        position: "relative",
        justifyContent: "space-between"
    },
    actionContainer: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    }
})