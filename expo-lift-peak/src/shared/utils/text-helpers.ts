export function camelCaseToWords(camelCaseStr: string): string {
    return camelCaseStr
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase();
}