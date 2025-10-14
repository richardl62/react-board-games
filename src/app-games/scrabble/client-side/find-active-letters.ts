import { ScrabbleContext } from "./scrabble-context";
import { RowCol } from "./get-words-and-score";


export function findActiveLetters(context: ScrabbleContext): RowCol[] {
    const active: RowCol[] = [];

    const board = context.board;
    for (let row = 0; row < board.length; ++row) {
        for (let col = 0; col < board[row].length; ++col) {
            if (board[row][col]?.active) {
                active.push({ row: row, col: col });
            }
        }
    }

    return active;
}
