import { boardColumns, boardRows, Letter } from "../config";


export function makeEmptyGrid(): (Letter | null)[][] {
    const board: (Letter | null)[][] = [];

    const row = [];
    for (let c = 0; c < boardColumns; ++c) {
        row.push(null);
    }

    for (let r = 0; r < boardRows; r++) {
        board[r] = [...row];
    }
    return board;
}
