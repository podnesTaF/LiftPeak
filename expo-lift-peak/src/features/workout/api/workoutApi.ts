import api from "@shared/api/AxiosInstance";
import {CreateWorkoutDto, IWorkoutPreview} from "../model";
import {CreateExerciseLogDto} from "@features/exercise-logger";

export const getRoutineList = async (): Promise<IWorkoutPreview[]> => {
    const {data} = await api.get<IWorkoutPreview[]>("workouts/routine/list");
    return data
}

export const addExercises = async (workoutId: string, exercises: CreateExerciseLogDto) => {
    const {data} = await api.post(`/workout-log/${workoutId}/exercises`, exercises);
    return data
}

export const createWorkout = async (createWorkoutDto: CreateWorkoutDto, exercises: CreateExerciseLogDto) => {
    const {data} = await api.post("/workouts", createWorkoutDto);

    const workoutId = data.id;

    await addExercises(workoutId, exercises)

    return data
}