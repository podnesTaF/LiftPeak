import React from 'react';
import {StyleSheet, Text, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {useDiscardWorkout, useWorkout} from "@features/workout-logger/hooks";
import {Ionicons} from "@expo/vector-icons";
import {Link, useRouter} from "expo-router";
import Button from "@shared/components/Button";
import {ExerciseItem} from "@features/workout-logger/ui";
import CustomBottomSheet from "@shared/components/bottomSheet/CustomBottomSheet";

const WorkoutLogger = ({isRoutine}: {isRoutine?: boolean}) => {
    const {exerciseLogs, clearWorkout, clearExercises} = useWorkout(isRoutine);
    const {discardWorkoutWithMedia} = useDiscardWorkout()
    const router = useRouter();

    const openExerciseLog = (exerciseLogId: number | string) => {
        router.push({
            pathname: "/(authenticated)/workout/exercise-log",
            params: {
                id: exerciseLogId
            }
        });
    }

    const discardWorkout = async () => {
        if(isRoutine) {
            clearExercises()
            clearWorkout()
        } else {
            await discardWorkoutWithMedia()
        }

        router.back();
    };


    return (
       <View style={{paddingVertical: 16, paddingHorizontal: 12, gap: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.dark500}}>
           {exerciseLogs.length ? exerciseLogs.sort((a, b) => a.order - b.order).map((item, index) => (
               <ExerciseItem onPress={openExerciseLog} key={index + "_" + item.id} item={item} index={index} isLast={index === (exerciseLogs.length - 1)} />
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
               <Link href={{pathname:"/(authenticated)/workout/exercises", params: {type: isRoutine ? "routine" : "workout"}}} asChild>
                   <Button fullWidth title={"Add Exercise"} color={"white"}>
                       <Ionicons name={"add"} color={"black"} size={24} />
                   </Button>
               </Link>
               <Button onPress={discardWorkout} fullWidth title={"Discard Workout"} color={"danger"}/>
           </View>
       </View>
    );
};

export default WorkoutLogger;