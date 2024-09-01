import { z } from 'zod';

const CreateWorkoutLogDtoSchema = z.object({
    workoutId: z.number().nullable().optional(),
    durationInS: z.number().optional(),
    startTime: z.string().optional(),
    totalVolume: z.number().optional(),
    totalDistanceInM: z.number().optional(),
});

const CreateWorkoutDtoSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    isRoutine: z.boolean().optional(),
    routineId: z.number().nullable().optional(),
    createLogDto: CreateWorkoutLogDtoSchema.nullable().optional(),
    mediaUrls: z.array(z.string()).optional(),
});

export type CreateWorkoutDto = z.infer<typeof CreateWorkoutDtoSchema>;

export { CreateWorkoutDtoSchema, CreateWorkoutLogDtoSchema };