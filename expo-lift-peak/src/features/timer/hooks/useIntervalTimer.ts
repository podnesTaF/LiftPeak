import { useEffect } from 'react';
import { useTimerStore } from '../store/timerStore';

const useTimerInterval = () => {
    const { isRunning, updateElapsedTime } = useTimerStore();

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning) {
            interval = setInterval(() => {
                const timerState = useTimerStore.getState();
                if (timerState.startTime) {
                    const newElapsedTime = Math.floor((Date.now() - timerState.startTime) / 1000);

                    updateElapsedTime(newElapsedTime);
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning, updateElapsedTime]);
};

export default useTimerInterval;