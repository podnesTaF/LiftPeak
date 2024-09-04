import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const REST_TIMER_TASK_NAME = 'REST_TIMER_TASK';

interface RestStoreState {
    restStartTime: number | null;
    restDuration: number | null;
    isResting: boolean;
    setRestTimer: (duration: number) => void;
    completeRest: () => void;
    clearRest: () => void;
}



export const useRestStore = create<RestStoreState>()(
    persist(
        (set, get) => ({
            restStartTime: null,
            restDuration: null,
            isResting: false,

            setRestTimer: (duration: number) => {
                set({
                    restDuration: duration,
                    restStartTime: Date.now(),
                    isResting: true,
                });

                registerRestTimerTask();
            },

            completeRest: () => {
                set({
                    isResting: false,
                    restStartTime: null,
                    restDuration: null,
                });

                unregisterRestTimerTask();
            },

            clearRest: () => {
                set({
                    restStartTime: null,
                    restDuration: null,
                    isResting: false,
                });
                unregisterRestTimerTask();
            },
        }),
        {
            name: 'rest-timer-storage', // This key differentiates the storage
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);


// Background Task Manager Logic for Rest Timer

TaskManager.defineTask(REST_TIMER_TASK_NAME, async () => {
    const { restStartTime, restDuration, isResting, completeRest } = useRestStore.getState();

    if (!restStartTime || !isResting) {
        return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const currentTime = Date.now();
    const elapsedRestTime = Math.floor((currentTime - restStartTime) / 1000); // Convert to seconds

    if (elapsedRestTime >= (restDuration || 0)) {
        completeRest();
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
});

// Function to Register the Background Task
export const registerRestTimerTask = async (): Promise<void> => {
    try {
        await BackgroundFetch.registerTaskAsync(REST_TIMER_TASK_NAME, {
            minimumInterval: 1,
            stopOnTerminate: false,
            startOnBoot: true,
        });
        console.log('Rest timer background task registered');
    } catch (err) {
        console.error('Rest timer background task registration failed:', err);
    }
};

export const unregisterRestTimerTask = async (): Promise<void> => {
    try {
        await BackgroundFetch.unregisterTaskAsync(REST_TIMER_TASK_NAME);
        console.log('Rest timer background task unregistered');
    } catch (err) {
        console.error('Rest timer background task unregistration failed:', err);
    }
};