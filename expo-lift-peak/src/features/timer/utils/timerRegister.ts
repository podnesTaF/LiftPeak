import * as BackgroundFetch from 'expo-background-fetch';
import BACKGROUND_TASK_NAME from './timerBackgroundTask';

export const registerBackgroundTask = async (): Promise<void> => {
    try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
            minimumInterval: 60,
            stopOnTerminate: false,
            startOnBoot: true,
        });

        console.log('Background task registered');
    } catch (err) {
        console.error('Background task registration failed:', err);
    }
}