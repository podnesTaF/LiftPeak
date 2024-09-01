import React, {useEffect, useState} from 'react';
import {Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {
    ExerciseItem,
    useDiscardWorkout,
    useExerciseStore,
    useWorkoutHeaderAnimation,
    useWorkoutStore
} from "@features/workout-logger";
import {useAuthStore} from "@features/auth";
import Button from "@shared/components/Button";
import {Link, Stack, useRouter} from "expo-router";
import { useTimerStore} from "@features/timer";
import {formatTime} from "@shared/utils";
import {Ionicons} from "@expo/vector-icons";
import useTimerInterval from "@features/timer/hooks/useIntervalTimer";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native-gesture-handler';
import InputField from "@shared/components/form/InputField";
import {useAnimatedScroll} from "@shared/components/AnimatedScrollContext";

const Index = () => {

    const {user} = useAuthStore()
    const {exerciseLogs, clearExercises, reorder} = useExerciseStore();
    const {
        isRunning,
        pauseTimer,
        elapsedTime,
        playTimer,
    } = useTimerStore();
    const {workout, updateWorkoutField} = useWorkoutStore()
    const {discardWorkoutWithMedia} = useDiscardWorkout()

    const router = useRouter();
    const scrollY = useSharedValue(0);

    const { snackbarOpacity, clockTitleStyle, headerTitleStyle} = useWorkoutHeaderAnimation(scrollY)

    useTimerInterval();

    const openExerciseLog = (exerciseLogId: number | string) => {
        router.push({
            pathname: "/(authenticated)/workout/exercise-log",
            params: {
                id: exerciseLogId
            }
        });
    }

    const discardWorkout = async () => {
        await discardWorkoutWithMedia()
        router.replace("/(authenticated)/(tabs)/start");
    };

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    return (
        <>
            <Stack.Screen options={{
                headerStyle: {
                    backgroundColor: Colors.dark700
                },
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name={"chevron-down"} size={32} color={Colors.dark300}/>
                    </TouchableOpacity>
                ),
                headerTitle: () => (
                    <View style={{ position: 'relative', justifyContent: "center", alignItems: "center" }}>
                        <Animated.Text style={[{ color: "white", fontWeight: "semibold", fontSize: 16}, headerTitleStyle]}>
                            Active Workout
                        </Animated.Text>
                        <Animated.View style={[{position: 'absolute', flexDirection: "row", gap: 12, alignItems: "center", zIndex: 20}, clockTitleStyle]}>
                            <Pressable onPress={() => isRunning ? pauseTimer() : playTimer()} >
                                {isRunning ? (
                                    <Ionicons name={"pause-circle"} size={40} color={Colors.lime}/>
                                ) : (
                                    <Ionicons name={"play-circle"} size={40} color={Colors.lime}/>
                                )}
                            </Pressable>
                            <Text style={{ color: "white", fontWeight: "semibold", fontSize: 16 }}>
                                {formatTime(elapsedTime)}
                            </Text>
                        </Animated.View>
                    </View>
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={() => router.push("/(authenticated)/workout/workout-save")}>
                        <Text style={{fontSize: 16, fontWeight: "500", color: Colors.success}}>
                            Complete
                        </Text>
                    </TouchableOpacity>
                ),
                headerShadowVisible: false
            }}/>
            <KeyboardAvoidingView behavior={
                Platform.OS === "ios" ? "padding" : "height"
            }
                                  style={{flex: 1, backgroundColor: Colors.dark900}}>
                <Animated.ScrollView stickyHeaderIndices={[0]} onScroll={onScroll} contentContainerStyle={{paddingBottom: 70}}>
                    <View style={styles.snackbarContainer}>
                        <TouchableOpacity>
                            <View style={{flexDirection: "row", gap: 8, alignItems: 'center'}}>
                                <Ionicons name={"time"} color={Colors.success} size={32} />
                                <View style={{gap:10, alignItems: 'flex-end', flexDirection: "row"}}>
                                    <Text numberOfLines={1} style={{color: Colors.success, fontSize: 16, fontWeight: "semibold"}}>{formatTime(elapsedTime)}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 12}}>
                            <Text style={{color: Colors.dark100, fontWeight: "600"}}>
                                16 sets · 34000kg
                            </Text>
                            <TouchableOpacity onPress={() => isRunning ? pauseTimer() : playTimer()}>
                                {isRunning ? (
                                    <Ionicons name={"pause-circle-outline"} color={Colors.success} size={40}/>
                                ) : (
                                    <Ionicons name={"play-circle-outline"} color={Colors.success} size={40}/>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <InputField color={'transparent'} placeholder="Workout Title" value={workout?.title || ''} onChange={(text) => updateWorkoutField({title: text})} />
                    <View style={{paddingVertical: 16, paddingHorizontal: 12, gap: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.dark500}}>
                        {exerciseLogs.length ? exerciseLogs.sort((a, b) => a.order - b.order).map((item, index) => (
                            <ExerciseItem onPress={openExerciseLog} key={item.id} item={item} index={index} isLast={index === (exerciseLogs.length - 1)} />
                        )) : (
                            <View style={{gap: 16}}>
                                <View style={{flexDirection: "row", gap: 6, alignItems: 'center'}}>
                                    <View style={{borderRadius: 100, backgroundColor: Colors.dark500, padding: 8}}>
                                        <Ionicons name={"flash-outline"} color={"white"} size={20} />
                                    </View>
                                    <Text style={defaultStyles.smallTitle}>
                                        Start by adding exercises
                                    </Text>
                                </View>
                                <Text style={defaultStyles.secondaryText}>
                                    Routines are set of exercises. You can define necessary amount of sets, reps, weights etc. These dimensions can be adjusted while running workout
                                </Text>
                            </View>
                        )}
                        <View style={{gap: 12, marginTop: 12}}>
                            <Link href={"/(authenticated)/workout/exercises"} asChild>
                                <Button fullWidth title={"Add Exercise"} color={"white"}>
                                    <Ionicons name={"add"} color={"black"} size={24} />
                                </Button>
                            </Link>
                            <Button onPress={discardWorkout} fullWidth title={"Discard Workout"} color={"danger"}/>
                        </View>
                    </View>
                </Animated.ScrollView>
            </KeyboardAvoidingView>
        </>
    );
};

const styles = StyleSheet.create({
    snackbarContainer: {
        backgroundColor: Colors.dark700,
        flexDirection: "row",
        flexWrap: "nowrap",
        gap: 12,
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        marginBottom: 20,
        borderBottomColor: Colors.dark700,
        borderBottomWidth: StyleSheet.hairlineWidth
    }
})

export default Index;