import React from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import {Colors} from "@shared/styles";
import {
    useWorkoutStore
} from "@features/workout-logger";
import {Link, Stack, useRouter} from "expo-router";
import { useTimerStore} from "@features/timer";
import {formatTime} from "@shared/utils";
import {Ionicons} from "@expo/vector-icons";
import useTimerInterval from "@features/timer/hooks/useIntervalTimer";

import {TouchableOpacity} from 'react-native-gesture-handler';
import InputField from "@shared/components/form/InputField";
import WorkoutLogger from "@features/workout-logger/ui/WorkoutLogger";
import BottomControl from "@features/workout-logger/ui/BottomControl";

const Index = () => {
    const {
        isRunning,
        pauseTimer,
        elapsedTime,
        playTimer,
    } = useTimerStore();
    const {workout, updateWorkoutField} = useWorkoutStore()


    const router = useRouter();

    useTimerInterval();

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
                        <Text style={[{ color: "white", fontWeight: "semibold", fontSize: 16}]}>
                            Active Workout
                        </Text>
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
                <ScrollView stickyHeaderIndices={[0]} contentContainerStyle={{paddingBottom: 70}}>
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
                    <WorkoutLogger />
                </ScrollView>
            </KeyboardAvoidingView>
            <BottomControl />
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