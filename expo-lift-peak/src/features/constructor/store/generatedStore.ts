import {IExercise, ITarget} from "@entities/exercise";
import {GenerateDto} from "@features/constructor/model/GenerateDto";
import {create} from "zustand";

interface GeneratedState {
    suggestedExercises: {
        exercise: IExercise;
        sets: number;
        restTime: number;
    }[];
    targetStats: {target: ITarget, exerciseAmount: number}[];
    settings: GenerateDto;
    isLoading: boolean;
    error: string | null;
    addSettings: (data: GenerateDto) => void;
    finishGenerateWorkout: (suggestedExercises: GeneratedState['suggestedExercises'], targetStats: GeneratedState['targetStats']) => void;
    changeExercise: (prevExerciseId: number, newExercise: IExercise) => void;
    getSetsAmount: () => number;
    clear: () => void;
}

export const useGeneratedStore = create<GeneratedState>((set,get) => ({
    suggestedExercises: [],
    targetStats: [],
    settings: {} as GenerateDto,
    isLoading: false,
    error: null,
    addSettings: (data: GenerateDto) => {
      set({settings: data, isLoading: true, error: null});
    },
    finishGenerateWorkout: (suggestedExercises: GeneratedState['suggestedExercises'], targetStats: GeneratedState['targetStats']) => {
        set({suggestedExercises, targetStats, isLoading: false});
    },
    changeExercise: (prevExerciseId: number, newExercise: IExercise) => {
        set({suggestedExercises: get().suggestedExercises.map(e => e.exercise.id === prevExerciseId ? {...e, exercise: newExercise} : e)});
    },
    getSetsAmount: () => {
        return get().suggestedExercises.reduce((acc, curr) => acc + curr.sets, 0);
    },
    clear: () => {
        set({suggestedExercises: [], targetStats: [], settings: {} as GenerateDto, isLoading: false, error: null});
    }
}))