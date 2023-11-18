import { sAssert } from "../../../utils/assert";
import { LegalWord } from "../../../utils/word-finder/get-legal-words/get-legal-words-for-board";
import { Letter, ScoringConfig, blank } from "../config";
import { BoardAndRack } from "../client-side/board-and-rack";
import { RowCol, getScore } from "../client-side/get-words-and-score";


export function wordScore(br: BoardAndRack, possbileWord: LegalWord, config: ScoringConfig): number {
    // Inefficient
    const board = br.getBoard().map(row => [...row]);
    const rack = [...br.getRack()];

    const removeFromRack = (required: string): "letter" | "blank" => {
        const index = rack.findIndex(l => l === required);
        if (index >= 0) {
            rack[index] = null;
            return "letter";
        }

        /* Start of sanity check */
        const blankIndex = rack.findIndex(l => l === blank);
        sAssert(blankIndex >= 0, "blank not found in rack");
        rack[blankIndex] = null;
        /* End of sanity check */
        return "blank";
    };

    const { word, direction } = possbileWord;
    let { row, col } = possbileWord;

    const active: RowCol[] = [];
    for (const letter of word) {
        const square = board[row][col];
        sAssert(square !== undefined, `board[${row}][${col}] is undefined`);

        if (square) {
            sAssert(square.letter === letter, "Unexpected letter on board");
        } else {
            active.push({ row, col });
            board[row][col] = {
                letter: letter as Letter,
                active: true,
                isBlank: removeFromRack(letter) === "blank",
            };
        }

        if (direction === "row") {
            ++col;
        } else {
            ++row;
        }
    }

    const score = getScore(board, active, config);

    return score;
}
