import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { useTimerStore } from '@features/timer/store/timerStore';
const BACKGROUND_TASK_NAME = 'WORKOUT_TIMER';

TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
    try {
        const { startTime, isRunning, clearBackgroundTaskFlag } = useTimerStore.getState();
        console.log('Clearing background task');
        if (clearBackgroundTaskFlag) {
            console.log('Clearing background task');
            return BackgroundFetch.BackgroundFetchResult.NoData;
        }

        if (startTime && isRunning) {
            const currentTime = Date.now();
            const newElapsedTime = currentTime - startTime;
            useTimerStore.getState().updateElapsedTime(Math.floor(newElapsedTime / 1000));
        }

        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (err) {
        console.error(err);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});

export default BACKGROUND_TASK_NAME;