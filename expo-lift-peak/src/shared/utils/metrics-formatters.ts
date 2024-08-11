export const formatVolume = (volume?: number) => {
    if(!volume) {
        return "";
    }
    return `${volume} kg`;
};

export const formatDistance = (distanceInM?: number) => {
    if(!distanceInM) {
        return "";
    }
    const distanceInKm = (distanceInM / 1000).toFixed(1);
    return `${distanceInKm}km`;
};
