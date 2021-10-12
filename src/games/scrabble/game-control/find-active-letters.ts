import { RowCol } from "./get-words-and-score";
import { Actions } from "./actions";


export function findActiveLetters(actions: Actions): RowCol[] {
    const active: RowCol[] = [];

    const board = actions.board;
    for (let row = 0; row < board.length; ++row) {
        for (let col = 0; col < board[row].length; ++col) {
            if (board[row][col]?.active) {
                active.push({ row: row, col: col });
            }
        }
    }

    return active;
}
