import React, {useRef, useState} from 'react';
import {View, StyleSheet, Text, Alert, Pressable} from "react-native";
import {getExerciseTargetsToString} from "@features/workout-logger/utils";
import {useExerciseStore} from "@features/workout-logger/store/exerciseStore";
import {Colors} from "@shared/styles";
import Avatar from "@shared/components/Avatar";
import {Ionicons} from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import SwipeableRow from "@shared/components/SwipeableRow";
import Animated, {FadeInUp, FadeOutUp} from "react-native-reanimated";
import {RenderItemParams, ScaleDecorator} from "react-native-draggable-flatlist";
import {IExerciseLog} from "@entities/workout-log";

interface ExerciseItemProps extends RenderItemParams<IExerciseLog> {
    onPress?: (itemId: number | string) => void;
}

export const ExerciseItem = ({item, onPress, drag, isActive, getIndex}: ExerciseItemProps) => {
    const {getExerciseSetsStats, removeExerciseLog} = useExerciseStore();
    const [isPressed, setIsPressed] = useState(false);
    const pressTimerRef = useRef<NodeJS.Timeout | null>(null);



    const confirmAlert = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert("Delete Exercise", "Are you sure you want to delete this exercise?", [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            {text: "Delete", onPress: () => removeExerciseLog(item.id), style: "destructive"}
        ])
    }

    const handlePressIn = () => {
        setIsPressed(true);
        pressTimerRef.current = setTimeout(() => {
            setIsPressed(false);
        }, 100); // Adjust the timeout duration as needed
    };

    const handlePressOut = () => {
        if (pressTimerRef.current) {
            clearTimeout(pressTimerRef.current);
        }
        setIsPressed(false);
    };

    const handlePress = () => {
        if (isPressed && onPress) {
            onPress(item.id);
        }
    };


    return (
        <ScaleDecorator>
            <SwipeableRow onDelete={confirmAlert}>
                <Animated.View entering={FadeInUp.delay((getIndex() || 1) * 20)}
                               exiting={FadeOutUp}>
                    <Pressable
                        onLongPress={drag}
                        disabled={isActive}
                        style={({pressed}) => [styles.container, {opacity: pressed ? 0.7 : 1}]}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={handlePress}
                    >
                        <View style={{flexDirection: "row", alignItems: "center", gap: 16}}>
                            <Avatar name={""} size={64} url={item.exercise?.previewUrl}>
                                <Ionicons name={"barbell"} size={40} color={Colors.white}/>
                            </Avatar>
                            <View style={{justifyContent: "space-between", gap: 12}}>
                                <View>
                                    <Text style={{
                                        fontSize: 18,
                                        textTransform: "uppercase",
                                        fontWeight: "600",
                                        color: "white"
                                    }}>
                                        {item.exercise?.name}
                                    </Text>
                                    <Text style={{fontSize: 14, fontWeight: "500", color: Colors.dark300}}>
                                        {getExerciseTargetsToString(item.exercise?.exerciseTargets)}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={{fontSize: 16, fontWeight: "700", color: Colors.lime}}>
                                        {getExerciseSetsStats(item.id).totalSets} / {getExerciseSetsStats(item.id).setsDone} Sets
                                        Done
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <Ionicons name={"chevron-forward"} size={32} color={Colors.lime}/>
                    </Pressable>
                </Animated.View>
            </SwipeableRow>
        </ScaleDecorator>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark500,
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 16
    }
});
