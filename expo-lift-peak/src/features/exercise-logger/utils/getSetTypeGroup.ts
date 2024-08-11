import {ISet} from "@entities/workout-log";

export const getSetTypeGroup = (sets: ISet[]) => {
    const warmup = sets.filter((set) => set.type === "warmup");
    const workout = sets.filter((set) => set.type === "workout");

    return {
        warmup,
        workout,
    };
}