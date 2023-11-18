import { sAssert } from "../../../utils/assert";
import { tileScore } from "./extended-letter";
import { BoardData } from "../server-side/game-state";
import { ScoringConfig, multipliers } from "../config";

interface RowCol {
    row: number;
    col: number;
}

function scoreWord(board: BoardData, word: RowCol[], config: ScoringConfig): number {
    let score = 0;
    let wordMult = 1;

    word.forEach(rc => {
        const sq = board[rc.row][rc.col];
        sAssert(sq);

        if(sq.active) {
            const mults = multipliers(
                config.boardLayout[rc.row][rc.col]
            );
            score += tileScore(sq) * mults.letter;
            wordMult *= mults.word;
        } else {
            score += tileScore(sq);
        }
    });

    return score * wordMult;
}

export function scoreWords(board: BoardData, words: RowCol[][], scabbleConfig: ScoringConfig) : number {
    let score = 0;
    words.forEach(word => {score += scoreWord(board, word, scabbleConfig);});

    return score;
}

