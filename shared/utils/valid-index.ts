export function isValidIndex<T>(array: T[], index: number): boolean {
    return index >= 0 && index < array.length;
}