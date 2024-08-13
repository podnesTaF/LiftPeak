export type TBodyShape = {
    front: {
        path: string;
        muscles: TMuscleGroup
    },
    back: {
        path: string;
        muscles: TMuscleGroup
    }
}

export type TMuscleGroup = {
    [key: string]: {
        paths: string[];
    }
}