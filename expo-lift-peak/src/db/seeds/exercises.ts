import {ExpoSQLiteDatabase} from "drizzle-orm/expo-sqlite";
import {exercise} from "@db/schema";

export const seedExercises = async (database:  ExpoSQLiteDatabase<Record<string, never>>) => {
    const exercisesData = [
        {
            id: 17,
            name: "Bent Over Row",
            previewUrl: "https://storage.googleapis.com/lift-peak/exercises%2F17%2Fpreview%2Fpreview-bent.jpg",
            type: "STRENGTH",
            equipment: "BARBELL",
            metric: "reps",
        },
        {
            id: 18,
            name: "Bench Press",
            previewUrl: "https://storage.googleapis.com/lift-peak/exercises%2F18%2Fpreview%2Fpreview-bent.jpg",
            type: "STRENGTH",
            equipment: "BARBELL",
            metric: "reps",
        },
        {
            id: 19,
            name: "Biceps Curl",
            previewUrl: "https://storage.googleapis.com/lift-peak/exercises%2F19%2Fpreview%2Frunning.jpg",
            type: "STRENGTH",
            equipment: "BARBELL",
            metric: "reps",
        },
        {
            id: 20,
            name: "Running",
            previewUrl: "https://storage.googleapis.com/lift-peak/exercises%2F20%2Fpreview%2Frunning.jpg",
            type: "STRENGTH",
            equipment: "BARBELL",
            metric: "distance",
        },
    ];

    for (const newExercise of exercisesData) {
        await database.insert(exercise).values({
            id: newExercise.id,
            name: newExercise.name,
            previewUrl: newExercise.previewUrl,
            type: newExercise.type,
            equipment: newExercise.equipment,
            metric: newExercise.metric,
        });
    }
};