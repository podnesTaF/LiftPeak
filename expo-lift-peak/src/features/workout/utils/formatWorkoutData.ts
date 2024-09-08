import {IExerciseLog, IWorkoutLog} from "@entities/workout-log";
import {IWorkout} from "@entities/workout";

export const formatExercises = (exerciseLogs: IExerciseLog[]) => {
    console.log(exerciseLogs.map(log => log.sets))
    return exerciseLogs.map(log => ({
        workoutLogId: null,
        exerciseId: log.exercise!.id,
        order: log.order || null,
        sets: log.sets?.map(set => ({
            order: set.order || null,
            type: set.type,
            distanceInM: set.distanceInM ? +set.distanceInM : null,
            weight: set.weight ? +set.weight : null,
            timeInS: set.timeInS ? +set.timeInS : null,
            reps: set.reps ? +set.reps : null,
            previousSetId: set.previousSetId || null,
            restInS: set.restInS ? +set.restInS : null,
        })) || [],
    }));
}

export const formatWorkoutData = ({workout,startTime, workoutLog, exerciseLogs, workoutMedia, elapsedTime, routineId}: {
    workout?: IWorkout | null,
    workoutLog?: IWorkoutLog | null,
    exerciseLogs?: IExerciseLog[],
    workoutMedia?: { actualUrl: string, thumbnailUrl: string }[],
    startTime?: number | null,
    elapsedTime?: number,
    routineId?: number | null,
}) => {
    return {
        title: workout?.title,
        description: workout?.description,
        isRoutine: workout?.isRoutine || false,
        routineId: routineId,
        mediaUrls: workoutMedia?.map(media => media.actualUrl),
        createLogDto: {
            durationInS: elapsedTime,
            startTime: startTime ? new Date(startTime).toISOString() : undefined,
            totalVolume: exerciseLogs?.reduce((total, log) => total + (log.sets?.reduce((t, s) => t + (s.weight ? +s.weight : 0), 0) || 0), 0) || 0,
            totalDistanceInM: 0,
        },
    }
}