import {useTimerStore} from "@features/timer";
import {useExerciseStore, useWorkoutStore} from "../store";
import {Alert} from "react-native";

export const useDiscardWorkout = () => {
    const { clearTimer } = useTimerStore();
    const { clearWorkout } = useWorkoutStore();
    const { clearExercises } = useExerciseStore();

    const discardWorkout = () => {
        clearTimer();
        clearWorkout();
        clearExercises();
    }

    const discardAlert = () => {
        Alert.alert("Discard Workout", "Are you sure you want to discard this workout?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {text: "Discard", onPress: () => discardWorkout(), style: "destructive"}
        ])
    }

    return {discardWorkout, discardAlert}
}