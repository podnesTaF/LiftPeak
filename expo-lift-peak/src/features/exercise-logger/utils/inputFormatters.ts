
export const formatDistanceToM = (text: string) => {
    const [km, m] = text.split(",");
    console.log("distance",km, m);

    const cleanedText = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (cleanedText === '') return '';

    // Parse cleanedText into kilometers and decimal
    const num = parseFloat(cleanedText) / 100; // Treat input as km.mm (e.g., 10,00 is 10 km)
    return (num * 1000).toString(); // Convert kilometers to meters (e.g., 10.00 km -> 10000 meters)
};

export const formatDistanceToInput = (distanceInM: string) => {
    if (distanceInM === '') return '';

    const num = parseFloat(distanceInM) / 1000;
    return num.toFixed(2).replace('.', ',');
};

export const formatTimeInput = (text: string) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    if (cleanedText === '') return '';

    const paddedText = cleanedText.padStart(6, '0');

    const hours = paddedText.slice(0, 2);
    const minutes = paddedText.slice(2, 4);
    const seconds = paddedText.slice(4, 6);

    return `${hours}:${minutes}:${seconds}`;
};
