import {IExerciseTarget} from "@entities/exercise";

export const getExerciseTargetsToString = (exerciseTargets?: IExerciseTarget[]): string | undefined => {
    return exerciseTargets?.map(exerciseTarget => exerciseTarget.target?.name).join(' • ');
}