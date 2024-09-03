import api from "@shared/api/AxiosInstance";
import {IWorkoutPreview} from "@features/workout";
import {IWorkout} from "@entities/workout";

export const addToRoutine = async ({workoutId}: {workoutId: number}) => {
    const {data} = await api.post("/workouts/routine/add", {workoutId});
    return data;
}

export const getRoutineList = async (): Promise<IWorkoutPreview[]> => {
    const {data} = await api.get<IWorkoutPreview[]>("workouts/routine/list");
    return data
}

export const getRoutineToStart = async (id: number): Promise<IWorkout> => {
    const {data} = await api.get<IWorkout>("workouts/routine/" + id);
    return data
}