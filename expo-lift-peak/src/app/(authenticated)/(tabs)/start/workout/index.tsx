import React, {useEffect, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from "react-native";
import {Colors} from "@shared/styles";
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
import {registerBackgroundTask, unregisterTimer, useTimerStore} from "@features/timer";
import {formatTime} from "@shared/utils";
import {Ionicons} from "@expo/vector-icons";
import useTimerInterval from "@features/timer/hooks/useIntervalTimer";
import Animated, {
    useSharedValue
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {TouchableOpacity} from 'react-native-gesture-handler';
import DraggableFlatList from "react-native-draggable-flatlist/src/components/DraggableFlatList";
import {DragEndParams} from "react-native-draggable-flatlist";
import {IExerciseLog} from "@entities/workout-log";
import InputField from "@shared/components/form/InputField";

const Index = () => {

    const {user} = useAuthStore()
    const {exerciseLogs, clearExercises, reorder} = useExerciseStore();
    const {
        isRunning,
        pauseTimer,
        elapsedTime,
        playTimer,
    } = useTimerStore();
    const discardWorkoutFromStore = useDiscardWorkout()

    const router = useRouter();
    const scrollY = useSharedValue(0);

    const { snackbarOpacity, clockTitleStyle, headerTitleStyle} = useWorkoutHeaderAnimation(scrollY)

    useTimerInterval();

    const openExerciseLog = (exerciseLogId: number | string) => {
        router.push({
            pathname: "/(authenticated)/(tabs)/start/workout/exercise-log",
            params: {
                id: exerciseLogId
            }
        });
    }

    const discardWorkout = () => {
        discardWorkoutFromStore();
        router.replace("/(authenticated)/(tabs)/start");
    };

    const discardAlert = () => {
        Alert.alert("Discard Workout", "Are you sure you want to discard this workout?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {text: "Discard", onPress: () => discardWorkout(), style: "destructive"}
        ])
    }

    const onDragEnd = (params: DragEndParams<IExerciseLog>) => {
        reorder(params.from, params.to);
    }


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
                    <TouchableOpacity onPress={() => router.push("/(authenticated)/(tabs)/start/workout/workout-save")}>
                        <Text style={{fontSize: 16, fontWeight: "500", color: Colors.lime}}>
                            Save
                        </Text>
                    </TouchableOpacity>
                )
            }}/>
            <View style={{flex: 1, backgroundColor: Colors.dark900}}>
                <Animated.View style={[styles.snackbarContainer, snackbarOpacity]}>
                        <TouchableOpacity>
                            <View style={{flexDirection: "row", gap: 8, alignItems: 'center'}}>
                                <Ionicons name={"time"} color={Colors.lime} size={32} />
                                <View style={{gap:10, alignItems: 'flex-end', flexDirection: "row"}}>
                                    <Text numberOfLines={1} style={{color: Colors.lime, fontSize: 16, fontWeight: "semibold"}}>{formatTime(elapsedTime)}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                   <View style={{flexDirection: "row", alignItems: "center", gap: 12}}>
                       <Text style={{color: Colors.dark100, fontWeight: "600"}}>
                           16 sets · 34000kg
                       </Text>
                       <TouchableOpacity onPress={() => isRunning ? pauseTimer() : playTimer()}>
                           {isRunning ? (
                               <Ionicons name={"pause-circle-outline"} color={Colors.lime} size={40}/>
                           ) : (
                               <Ionicons name={"play-circle-outline"} color={Colors.lime} size={40}/>
                           )}
                       </TouchableOpacity>
                   </View>
                </Animated.View>
                <DraggableFlatList
                    style={{height: "100%"}}
                    onScrollOffsetChange={(offset) => {
                        scrollY.value = offset;
                    }}
                    data={exerciseLogs.sort((a, b) => a.order - b.order)}
                    renderItem={({item, drag, isActive, getIndex}) => (
                        <ExerciseItem onPress={openExerciseLog} key={item.id} item={item} drag={drag} isActive={isActive} getIndex={getIndex} />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEventThrottle={16}
                    ListHeaderComponent={() => <View style={{height: 70}} />}
                    ListFooterComponent={() =>  (
                        <View style={{marginTop: 20, gap: 20}}>
                            <Link href={"/(authenticated)/(tabs)/start/workout/exercises"} asChild>
                                <Button fullWidth title={"Add Exercise"} color={"lime"}/>
                            </Link>
                            <Button onPress={discardAlert} fullWidth title={"Discard Workout"} color={"danger"}/>
                        </View>
                    )
                    }
                    onDragEnd={onDragEnd}
                    onDragBegin={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    onPlaceholderIndexChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    activationDistance={10}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    snackbarContainer: {
        backgroundColor: Colors.dark500,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 100,
        borderBottomColor: Colors.dark100,
        borderWidth: StyleSheet.hairlineWidth
    }
})

export default Index;