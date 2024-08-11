import { z } from 'zod';
import {SetType} from "@entities/workout-log";

export const CreateSetDtoSchema = z.object({
    order: z.number().optional().nullable(),
    type: z.enum(['warmup','workout']),
    exerciseLogId: z.number().optional().nullable(),
    distanceInM: z.number().optional().nullable(),
    weight: z.number().optional().nullable(),
    timeInS: z.number().optional().nullable(),
    reps: z.number().optional().nullable(),
    previousSetId: z.number().optional().nullable(),
    restInS: z.number().optional().nullable(),
});


export const CreateExerciseLogDtoSchema = z.object({
    workoutLogId: z.number().optional().nullable(),
    exerciseId: z.number(),
    order: z.number().optional().nullable(),
    sets: z.array(CreateSetDtoSchema),
});

export const CreateExerciseLogDtoArraySchema = z.array(CreateExerciseLogDtoSchema);


export type CreateExerciseLogDto = z.infer<typeof CreateExerciseLogDtoArraySchema>;