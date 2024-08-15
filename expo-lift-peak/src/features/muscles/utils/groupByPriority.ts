import {IExerciseTarget} from "@entities/exercise";


const priorityMap: Record<number, 'Primary' | 'Secondary' | 'Tertiary'> = {
    1: 'Primary',
    2: 'Secondary',
    3: 'Tertiary',
};

interface GroupedMuscles {
    [key: string]: IExerciseTarget[];
}

export const groupByPriority = (muscles?: IExerciseTarget[]): {
    entries: [string, IExerciseTarget[]][]
} | undefined => {
    if (!muscles) return undefined;

    const grouped: GroupedMuscles = muscles.reduce((acc, muscle) => {
        if (!muscle.priority) return acc;

        const priorityKey = priorityMap[muscle.priority];
        if (acc[priorityKey]) {
            acc[priorityKey].push(muscle);
        } else {
            acc[priorityKey] = [muscle];
        }
        return acc;
    }, {} as GroupedMuscles);

    return {
        entries: Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0])),
    };
};