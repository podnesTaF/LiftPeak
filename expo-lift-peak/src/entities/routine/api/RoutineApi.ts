import api from "@shared/api/AxiosInstance";
import {IWorkoutPreview} from "@features/workout";

export const addToRoutine = async ({workoutId}: {workoutId: number}) => {
    const {data} = await api.post("/workouts/routine/add", {workoutId});
    return data;
}

export const getRoutineList = async (): Promise<IWorkoutPreview[]> => {
    const {data} = await api.get<IWorkoutPreview[]>("workouts/routine/list");
    return data
}
