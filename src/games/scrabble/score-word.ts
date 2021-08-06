
import { sAssert } from "../../shared/assert";
import { BoardData } from "./game-data";
import { Letter, letterScores, ScrabbleConfig } from "./scrabble-config";
import { multipliers } from "./square-type";

function letterScore(letter: Letter) {
    return letterScores[letter];
}

interface RowCol {
    row: number;
    col: number;
}

export function scoreWord(board: BoardData, word: RowCol[], scrabbleConfig: ScrabbleConfig) {
    let score = 0;
    let wordMult = 1;

    word.forEach(rc => {
        const sq = board[rc.row][rc.col];
        sAssert(sq);

        if(sq.active) {
            const mults = multipliers(
                scrabbleConfig.boardLayout[rc.row][rc.col]
            );
            score += letterScore(sq.letter) * mults.letter;
            wordMult *= mults.word;
        } else {
            score += letterScore(sq.letter);
        }
    })

    return score * wordMult;
}

export function scoreWords(board: BoardData, words: RowCol[][], scabbleConfig: ScrabbleConfig) : number {
    let score = 0;
    words.forEach(word => {score += scoreWord(board, word, scabbleConfig)});

    return score;
}

