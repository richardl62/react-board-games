
import { gAssert } from "../../shared/assert";
import { squareTypesArray } from "./scrabble-config";
import { BoardData } from "./game-data";
import { letterScore } from "./scrabble-config";
import { multipliers } from "./square-type";

interface RowCol {
    row: number;
    col: number;
}

export function scoreWord(board: BoardData, word: RowCol[]) {
    let score = 0;
    let wordMult = 1;

    word.forEach(rc => {
        const sq = board[rc.row][rc.col];
        gAssert(sq);

        if(sq.active) {
            const mults = multipliers(squareTypesArray[rc.row][rc.col]);
            score += letterScore(sq.letter) * mults.letter;
            wordMult *= mults.word;
        } else {
            score += letterScore(sq.letter);
        }
    })

    return score * wordMult;
}

export function scoreWords(board: BoardData, words: RowCol[][]) : number {
    let score = 0;
    words.forEach(word => {score += scoreWord(board, word)});

    return score;
}

