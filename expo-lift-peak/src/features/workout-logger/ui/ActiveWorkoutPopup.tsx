import React, {useCallback, useRef, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Dimensions} from "react-native";
import {Colors} from "@shared/styles";
import {Ionicons} from "@expo/vector-icons";
import {useWorkoutStore} from "../store";
import {useDiscardWorkout} from '../hooks'
import {useTimerStore} from "@features/timer";
import {useRouter} from "expo-router";
import {formatTime} from "@shared/utils";
import useTimerInterval from "@features/timer/hooks/useIntervalTimer";
import {BlurView} from "expo-blur";
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import BottomSheetBackgroundContainer
    from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackgroundContainer";
import BottomSheetBackground from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackground";
import Handle from "@shared/components/bottomSheet/CustomIndicator";
import Animated, {Extrapolation, interpolate, useAnimatedStyle, useSharedValue} from "react-native-reanimated";


export const ActiveWorkoutPopup = () => {
    const {workout} = useWorkoutStore();
    const {elapsedTime, pauseTimer, playTimer, isRunning} = useTimerStore();
    const [isIndex1, setIsIndex1] = useState(false);
    const  {discardAlert} = useDiscardWorkout();
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const bottomSheetRef = useRef<BottomSheet>(null);
    useTimerInterval();

    const handleSheetChanges = useCallback((index: number) => {
        if ((index - currentIndex) > 1) {
            const correctedIndex = index > currentIndex ? currentIndex + 1 : currentIndex - 1;
            bottomSheetRef.current?.snapToIndex(correctedIndex);
            return
        } else {
            setCurrentIndex(index);
        }
        if (index === 1) {
            setIsIndex1(true);
        } else {
            setIsIndex1(false);
        }
        if(index === 2) {
            router.push("/(authenticated)/workout")
            bottomSheetRef.current?.snapToIndex(0)
        }
    }, [currentIndex]);

    const handleComponent = useCallback((props: any) => (
        <Handle {...props} isIndex1={isIndex1} />
    ), [isIndex1])

    if(!workout) {
        return null
    }

    const navigateToWorkout = () => {
        router.push("/(authenticated)/workout")
    }

    const animatedSheetIndex = useSharedValue(0);
    const draggingAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            animatedSheetIndex.value,
            [0, 1],
            [0, 1],  // Visible after index 0
            Extrapolation.CLAMP
        );
        const translateY = interpolate(
            animatedSheetIndex.value,
            [0, 1],
            [50, 0],  // Slide up
            Extrapolation.CLAMP
        );
        return {
            opacity,
            transform: [{ translateY }]
        };
    });

    return (
       <BottomSheet backgroundStyle={{
           backgroundColor: "transparent"
       }}
                    animatedIndex={animatedSheetIndex}
                    handleComponent={handleComponent}
                    ref={bottomSheetRef}
                    snapPoints={["14%","22%", "30%"]}
                    onChange={handleSheetChanges}>
           <BottomSheetView style={[styles.container]}>
               <Animated.View style={[styles.content, draggingAnimatedStyle]}>
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
                   <TouchableOpacity onPress={discardAlert} style={[styles.actionContainer]}>
                       <Ionicons name={"close-outline"} size={24} color={Colors.danger} />
                       <Text style={{color: Colors.danger, fontWeight: "600", fontSize: 16}}>
                           Discard
                       </Text>
                   </TouchableOpacity>
               </View>
               </Animated.View>
           </BottomSheetView>
       </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
    },
    content: {
        flex: 1,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        padding: 16,
        width: "100%",
        backgroundColor: "rgba(43,44,52,0.7)",
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