import { intervalToDuration, formatDuration } from 'date-fns';

export const formatTime = (seconds: number) => {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    const hours = duration.hours ? `${duration.hours}h ` : '';
    const minutes = duration.minutes ? `${duration.minutes}m ` : '';
    const secs = `${duration.seconds || 0}s`;
    return `${hours}${minutes}${secs}`;
};