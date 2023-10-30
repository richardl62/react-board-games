export type WordDirection = "right" | "down";

export interface WordPosition {
    row: number;
    col: number;
    direction: WordDirection;
}
