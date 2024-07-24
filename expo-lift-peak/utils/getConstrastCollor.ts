const getLuminance = (hexColor: string) => {
    const rgb = parseInt(hexColor.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;

    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// Function to get contrast color (black or white) based on background color
export const getContrastColor = (hexColor: string) => {
    const code = hexColor.replace('#', '');
    const luminance = getLuminance(code);
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};