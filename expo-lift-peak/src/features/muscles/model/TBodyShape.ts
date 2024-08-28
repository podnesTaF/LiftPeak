export type TBodyShape = {
    front: {
        path: string;
    },
    back: {
        path: string;
    }
}

export type TMuscleGroup = {
    [key: string]: {
        paths: string[];
    }
}