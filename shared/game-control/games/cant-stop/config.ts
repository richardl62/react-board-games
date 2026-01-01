export const nDice = 4;

export const columnValues = [2,3,4,5,6,7,8,9,10,11,12];

export function maxColumnHeight(column: number): number {
    if (!columnValues.includes(column)) {
        throw new Error(`Invalid column: ${column}. Must be one of ${columnValues.join(', ')}`);
    }
    return 13 - 2 * Math.abs(7 - column);
}
