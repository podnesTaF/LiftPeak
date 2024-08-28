import {create} from "zustand";
import {IWorkout} from "@entities/workout";
import {IGroupPost} from "@entities/post";
import {CommentType} from "@entities/reaction";

interface CommentState {
    shown: boolean;
    workout: IWorkout | null;
    post: IGroupPost | null;
    type: CommentType;
    showWorkoutComments: (workout: IWorkout) => void;
    showPostComments: (post: IGroupPost) => void;
    hide: () => void;
}

export const useCommentStore = create<CommentState>((set) => ({
    workout: null,
    post: null,
    shown: false,
    type: CommentType.WORKOUT_POST,
    showWorkoutComments: (workout: IWorkout) => {
        set({ workout, shown: true, type: CommentType.WORKOUT_POST });
    },
    showPostComments: (post: IGroupPost) => {
        set({ post, shown: true, type: CommentType.GROUP_POST });
    },
    hide: () => {
        set({ workout: null, post: null, shown: false });
    },
}))