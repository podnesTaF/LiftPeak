import {ExerciseLevel, ExerciseType} from "@entities/exercise";

export interface GenerateDto {
    type: ExerciseType;
    level: ExerciseLevel;
    targetIds: number[];
    equipmentIds: number[];
    workoutTimeInSec: number;
    restBetweenSetsInSec: number;
}