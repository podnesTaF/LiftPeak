import {Instruction} from "@entities/exercise/model/Instruction";
import {IExerciseTarget} from "@entities/exercise/model/ITarget";
import {IExerciseLog, ISet} from "@entities/workout-log";
import {IExerciseMedia} from "@entities/media";
import {IEquipment} from "@entities/exercise";

export interface IExercise {
    id: number;
    name: string;
    previewUrl: string;
    type: ExerciseType;
    level: ExerciseLevel;
    equipment: IEquipment;
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
    BODYWEIGHT = 'bodyweight',
    DUMBBELLS = 'bumbbells',
    BARBELL = 'barbell',
    KETTLEBELL = 'kettlebell',
    MACHINE = 'machine',
    BAND = 'resistance band',
    BALL = 'ball',
}

export enum ExerciseMetric {
    time = 'time',
    distance = 'distance',
    reps = 'reps',
}
