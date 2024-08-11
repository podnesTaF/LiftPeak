import {useTimerStore} from "@features/timer";
import {useExerciseStore, useWorkoutStore} from "../store";

export const useDiscardWorkout = () => {
    const { clearTimer } = useTimerStore();
    const { clearWorkout } = useWorkoutStore();
    const { clearExercises } = useExerciseStore();

    return () => {
        clearTimer();
        clearWorkout();
        clearExercises();
    }
}