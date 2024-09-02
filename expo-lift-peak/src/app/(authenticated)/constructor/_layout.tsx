import React from 'react';
import {Stack, useRouter} from "expo-router";
import Button from '@shared/components/Button';
import {Colors, defaultStyles} from "@shared/styles";
import {Alert, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {BlurView} from "expo-blur";
import {Ionicons} from "@expo/vector-icons";
import Constants from "expo-constants";
import {WorkoutProvider} from "@features/workout/store/workoutContext";
import {useRoutineStore} from "@features/workout/store/routineStore";

const Layout = () => {
    const {
        clearExercises,
        clearWorkout,
    } = useRoutineStore();
    const router = useRouter();

    const handleBackAction = () => {
        Alert.alert("Discard Changes?", "You have unsaved changes. Are you sure you want to discard them?", [
            {
                text: "Keep and Exit",
                style: "cancel",
                onPress: () => {
                    router.back();
                }
            },
            {
                text: "Discard",
                style: "destructive",
                onPress: () => {
                    clearExercises();
                    clearWorkout();
                    router.back();
                }
            }
        ]);
    }

    return (
        <WorkoutProvider mode={"routine"}>
            <View style={{flex: 1, backgroundColor: Colors.dark900}}>
            <Stack>
                <Stack.Screen
                    name={"index"}
                    options={{
                        headerTintColor: "white",
                        headerStyle: {
                            backgroundColor: Colors.dark700,
                        },
                        header: () => (
                            <BlurView intensity={50} tint={"dark"} style={{flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: "center", paddingTop: Constants.statusBarHeight}}>
                                <TouchableOpacity onPress={handleBackAction}>
                                    <Ionicons name={"chevron-back"} size={30} color={"white"} />
                                </TouchableOpacity>
                                <View style={{paddingVertical: 16}}>
                                    <Text style={defaultStyles.smallTitle}>
                                        Create Workout
                                    </Text>
                                </View>
                                <Button style={{paddingVertical: 8, paddingHorizontal: 12}} color={"success"} title={"Save"}/>
                            </BlurView>
                        )
                    }}
                />
            </Stack>
        </View>
        </WorkoutProvider>
    );
};

export default Layout;