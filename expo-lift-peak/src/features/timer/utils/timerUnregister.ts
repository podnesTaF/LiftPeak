import * as BackgroundFetch from 'expo-background-fetch';
import BACKGROUND_TASK_NAME from './timerBackgroundTask';

export const unregisterTimer = () => {
  BackgroundFetch.unregisterTaskAsync(BACKGROUND_TASK_NAME).then(() => {
    console.log('Background task unregistered');
  }).catch((err) => {
    console.error('Failed to unregister background task:', err);
  });
};