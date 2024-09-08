export function camelCaseToWords(camelCaseStr: string): string {
    return camelCaseStr
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase();
}

export const cutString = (str: string, length: number) => {
    return str.length > length ? str.slice(0, length) + "..." : str
}