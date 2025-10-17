// Rows have constraint first index in a 2D array, columns have constant second index.

export type WordDirection = "row" | "column";

export interface WordPosition {
    row: number;
    col: number;
    direction: WordDirection;
}
