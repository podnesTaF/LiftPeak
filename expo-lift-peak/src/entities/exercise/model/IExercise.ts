import {Instruction} from "@entities/exercise/model/Instruction";
import {IExerciseTarget} from "@entities/exercise/model/ITarget";
import {IExerciseLog, ISet} from "@entities/workout-log";
import {IExerciseMedia} from "@entities/media";

export interface IExercise {
    id: number;
    name: string;
    previewUrl: string;
    type: ExerciseType;
    level: ExerciseLevel;
    equipment: ExerciseEquipment;
    metric: ExerciseMetric;
    instructions: Instruction[];
    exerciseTargets: IExerciseTarget[];
    exerciseLogs: IExerciseLog[];
    mediaFiles?: IExerciseMedia[];

    targetGroup?: string[];

    previousSets?: ISet[];

    createdAt: string;
    updatedAt: string;
}


export enum ExerciseType {
    CARDIO = 'CARDIO',
    STRENGTH = 'STRENGTH',
    FLEXIBILITY = 'FLEXIBILITY',
    BALANCE = 'BALANCE',
}

export enum ExerciseLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
}

export enum ExerciseEquipment {
    BODYWEIGHT = 'BODYWEIGHT',
    DUMBBELL = 'DUMBBELL',
    BARBELL = 'BARBELL',
    KETTLEBELL = 'KETTLEBELL',
    CABLE = 'CABLE',
    MACHINE = 'MACHINE',
    BAND = 'BAND',
    BALL = 'BALL',
}

export enum ExerciseMetric {
    time = 'time',
    distance = 'distance',
    reps = 'reps',
}
