const formatVolume = (volume) => {
    return `${volume.toFixed(3)} kg`;
};

const formatDistance = (distanceInM) => {
    const distanceInKm = (distanceInM / 1000).toFixed(1);
    return `${distanceInKm}km`;
};
