import {create} from "zustand";
import {IWorkout} from "@entities/workout";

interface CommentState {
    shown: boolean;
    workout: IWorkout | null;
    show: (workout: IWorkout) => void;
    hide: () => void;
}

export const useCommentStore = create<CommentState>((set) => ({
    workout: null,
    shown: false,
    show: (workout) => {
        set({ workout, shown: true});
    },
    hide: () => {
        set({ workout: null, shown: false });
    },
}))