
export const formatDistance = (text: string) => {
    const cleanedText = text.replace(/[^0-9]/g, '');

    if (cleanedText === '') return '';

    const num = parseFloat(cleanedText) / 100;

    return num.toFixed(2);
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