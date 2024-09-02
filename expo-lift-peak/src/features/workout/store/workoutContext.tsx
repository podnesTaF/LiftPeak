import React, { createContext, useContext } from 'react';

type Mode = 'workout' | 'routine';


interface WorkoutRoutineContextProps {
    mode: Mode;
}

const WorkoutRoutineContext = createContext<WorkoutRoutineContextProps | undefined>(undefined);

export const WorkoutProvider= ({ mode, children }: {
    mode: Mode;
    children: React.ReactNode;
}) => {
    return (
        <WorkoutRoutineContext.Provider value={{ mode }}>
            {children}
        </WorkoutRoutineContext.Provider>
    );
};

export const useWorkoutContext = () => {
    const context = useContext(WorkoutRoutineContext);
    if (!context) {
        throw new Error("useWorkoutRoutineContext must be used within a WorkoutRoutineProvider");
    }
    return context;
};

