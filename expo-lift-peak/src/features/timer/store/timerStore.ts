import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TimerState {
    isRunning: boolean;
    elapsedTime: number;
    clearBackgroundTaskFlag: boolean;
    startTime: number | null;
    setTimer: (isRunning: boolean, elapsedTime: number, startTime?: number) => void;
    clearTimer: () => void;
    startTimer: (elapsedTime?: number, startTime?: number) => void;
    updateElapsedTime: (elapsedTime: number) => void;
    updateStartTime: (elapsedTime: number) => void;
    pauseTimer: () => void;
    playTimer: () => void;
}

export const useTimerStore = create<TimerState>()(
    persist(
        (set, get) => ({
            isRunning: false,
            elapsedTime: 0,
            startTime: null,
            clearBackgroundTaskFlag: false,
            setTimer: (isRunning, elapsedTime, startTime) => {
                set({ isRunning, elapsedTime, startTime: startTime ?? null });
            },
            clearTimer: () => {
                set({ isRunning: false, elapsedTime: 0, startTime: null, clearBackgroundTaskFlag: true});
            },
            startTimer: (elapsedTime = 0, startTime = Date.now()) => {
                set({ isRunning: true, elapsedTime: get().elapsedTime || elapsedTime, startTime: get().startTime || startTime, clearBackgroundTaskFlag: false});
            },
            updateElapsedTime: (elapsedTime) => {
                set({ elapsedTime });
            },
            updateStartTime: (elapsedTime) => {
                const startTime = Date.now() - (elapsedTime * 1000)
                set({
                    startTime
                })
            },
            pauseTimer: () => {
                set({ isRunning: false });
            },
            playTimer: () => {
                const { elapsedTime } = get();
                set({ isRunning: true, startTime: Date.now() - elapsedTime * 1000 });
            }
        }),
        {
            name: 'timer-storage',
            storage:  createJSONStorage(() => AsyncStorage),
        }
    )
);