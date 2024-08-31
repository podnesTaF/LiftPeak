import React, {useRef, useState} from 'react';
import {View, StyleSheet, Text, Alert, Pressable} from "react-native";
import {getExerciseTargetsToString} from "@entities/exercise";
import {useExerciseStore} from "@features/workout-logger/store/exerciseStore";
import {Colors, defaultStyles} from "@shared/styles";
import Avatar from "@shared/components/Avatar";
import {Ionicons} from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import SwipeableRow from "@shared/components/SwipeableRow";
import Animated, {
    FadeInUp,
    FadeOutUp,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import {IExerciseLog} from "@entities/workout-log";
import ExerciseLog from "@features/exercise-logger/ui/ExerciseLog";
import Accordion from "@shared/components/Accordion";
import Button from "@shared/components/Button";

interface ExerciseItemProps {
    onPress?: (itemId: number | string) => void;
    item: IExerciseLog;
    index: number;
    isLast?: boolean;
}

export const ExerciseItem = ({item, onPress,index, isLast}: ExerciseItemProps) => {
    const open = useSharedValue(!!isLast);
    const {getExerciseSetsStats, removeExerciseLog} = useExerciseStore();
    const [isPressed, setIsPressed] = useState(false);
    const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

    const confirmAlert = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert("Delete Exercise", "Are you sure you want to delete this exercises?", [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            {text: "Delete", onPress: () => removeExerciseLog(item.id), style: "destructive"}
        ])
    }

    const onExpand = () => {
        open.value = !open.value;
    };

    const chevronStyle = useAnimatedStyle(() => {
        const rotation = interpolate(Number(open.value), [0, 1], [0, 90]);

        return {
            transform: [
                {
                    rotate: withTiming(`${rotation}deg`, {
                        duration: 200,
                    }),
                },
            ],
        };
    })

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
            <SwipeableRow actionTypes={['delete']} onDelete={confirmAlert}>
                <Animated.View entering={FadeInUp.delay((index) * 20)}
                               exiting={FadeOutUp}>
                    <Pressable
                        style={({pressed}) => [styles.container]}
                        onPressIn={handlePressIn}
                        onPress={onExpand}
                        onPressOut={handlePressOut}
                    >
                        <View style={{flexDirection: "row", alignItems: "center", gap: 16}}>
                            <Avatar name={""} size={64} url={item.exercise?.previewUrl}>
                                <Ionicons name={"barbell"} size={40} color={Colors.white}/>
                            </Avatar>
                            <View style={{justifyContent: "space-between", gap: 12}}>
                                <View>
                                    <Text style={{
                                        fontSize: 16,
                                        textTransform: "capitalize",
                                        fontWeight: "600",
                                        color: "white"
                                    }}>
                                        {item.exercise?.name}
                                    </Text>
                                    <Text style={defaultStyles.secondaryText}>
                                        {getExerciseTargetsToString(item.exercise?.exerciseTargets)}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={{fontSize: 14, fontWeight: "500", color: Colors.white}}>
                                        {getExerciseSetsStats(item.id).totalSets} / {getExerciseSetsStats(item.id).setsDone} Sets
                                        Done
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <Animated.View style={chevronStyle}>
                            <Ionicons name={"chevron-forward"} color={Colors.white} size={30} />
                        </Animated.View>
                    </Pressable>
                    <View style={[defaultStyles.row, {gap: 12}]}>
                        <Button color={"dark700"} style={{flex: 1, paddingVertical: 4}}>
                            <Ionicons name={"settings-outline"} size={24} color={Colors.white}/>
                        </Button>
                        <Button color={"dark700"} style={{flex: 1, paddingVertical: 4}}>
                            <Ionicons name={"timer-outline"} size={24} color={Colors.white}/>
                        </Button>
                        <Button color={"dark700"} style={{flex: 1, paddingVertical: 4}}>
                            <Ionicons name={"information-circle-outline"} size={24} color={Colors.white}/>
                        </Button>
                    </View>
                    <Accordion viewKey={"accordion"} isExpanded={open}>
                        <ExerciseLog exerciseId={item.id} />
                    </Accordion>
                </Animated.View>
            </SwipeableRow>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 16,
        paddingBottom: 16
    }
});
