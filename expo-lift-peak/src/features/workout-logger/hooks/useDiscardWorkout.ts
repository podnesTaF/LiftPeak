import {useTimerStore} from "@features/timer";
import {useExerciseStore, useWorkoutStore} from "../store";
import {Alert} from "react-native";
import {useMutation} from "@tanstack/react-query";
import {deleteMedia} from "@features/media-upload";

export const useDiscardWorkout = () => {
    const { clearTimer } = useTimerStore();
    const { clearWorkout, workoutMedia } = useWorkoutStore();
    const { clearExercises } = useExerciseStore();

    const {mutate: discardMedia} = useMutation({
        mutationFn: (url: string) => deleteMedia(url),
    })

    const clearMedia = async() => {
        for(const media of workoutMedia) {
            discardMedia(media.actualUrl);
        }
    }

    const discardWorkout = () => {
        clearTimer();
        clearWorkout();
        clearExercises();
    }

    const discardWorkoutWithMedia = async() => {
        await clearMedia();
        discardWorkout();
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

    return {discardWorkout,discardWorkoutWithMedia, clearMedia, discardAlert}
}