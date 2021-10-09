import { RowCol } from "./get-words-and-score";
import { ScrabbleData } from "./scrabble-data";


export function findActiveLetters(scrabbleData: ScrabbleData): RowCol[] {
    const active: RowCol[] = [];

    const board = scrabbleData.board;
    for (let row = 0; row < board.length; ++row) {
        for (let col = 0; col < board[row].length; ++col) {
            if (board[row][col]?.active) {
                active.push({ row: row, col: col });
            }
        }
    }

    return active;
}
