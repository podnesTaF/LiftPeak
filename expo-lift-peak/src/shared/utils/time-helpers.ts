import { intervalToDuration, formatDuration } from 'date-fns';

export const formatTime = (seconds?: number, short?: boolean) => {
    if(!seconds) {
        return "";
    }
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    const hours = duration.hours ? `${duration.hours}h ` : '';
    const minutes = duration.minutes ? `${duration.minutes}m` : '';
    const secs = `${duration.seconds || 0}s`;
    return `${hours}${minutes}${short ? "" : " " + secs}`;
};

export const getTimeObjFromSeconds = (seconds: number) => {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    return {
        hours: duration.hours || 0,
        minutes: duration.minutes || 0,
        seconds: duration.seconds || 0
    }
}

export const getSecondsFromTimeObj = (time: {hours: number, minutes: number, seconds: number}) => {
    return +time.hours * 3600 + +time.minutes * 60 + +time.seconds;
}