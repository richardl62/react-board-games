// Suitable for use as an Array.sort() comparision function
export function compareArrays<T>(
    a: T[], b: T[], 
    compare: (x: T, y: T) => number
): number {
    if (a.length !== b.length) {
        return a.length - b.length;
    }

    for (let i = 0; i < a.length; i++) {
        const cmp = compare(a[i], b[i]);
        if (cmp !== 0) {
            return cmp;
        }
    }

    return 0;
}

/** Return a sorted copy of values from which duplicates have been removed.
 * The comparision function is used for sorting and detecting duplicates.
 */
export function sortUnique<T>(
    values: T[], 
    compare: (a: T, b: T) => number
) : T[] {
    if(values.length === 0) {
        return [];
    }

    const sorted = [...values].sort(compare);

    const result: T[] = [sorted[0]];
    for(let i = 1; i < sorted.length; ++i) {
        if (compare(sorted[i], sorted[i - 1]) !== 0) {
            result.push(sorted[i]);
        }
    }
    return result;
}