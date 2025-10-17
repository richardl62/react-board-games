
export function nNonNull<T>(array: T[]): number {
    let count = 0;
    for (const val of array) {
        if (val !== null) {
            ++count;
        }
    }
    return count;
}
