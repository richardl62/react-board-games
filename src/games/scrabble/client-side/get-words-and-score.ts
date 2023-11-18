import { sAssert } from "../../../utils/assert";
import { BoardData, BoardSquareData } from "../server-side/game-state";
import { scoreWords } from "./score-word";
import { getWord } from "./game-actions";
import { ScrabbleContext } from "./scrabble-context";
import { ScoringConfig } from "../config";

/** Row and Column numbers for use on grid-based board. */
export interface RowCol {
    /** Row number */
    row: number;

    /** Column number */
    col: number;
}

function rowCol(row: number, col: number) {
    return {row: row, col: col};
}
type Direction = "row" | "col";

function otherDirection(dir : Direction) : Direction {
    return dir === "row" ? "col" : "row";
}


/** Check if all the positions have the same row (if
 *  direction === 'row') or column (if direction === 'col') 
 */
function sameRowCol(positions: RowCol[], direction: Direction) : boolean {
    const indices = positions.map(rc => rc[direction]);
    for (let i = 1; i < indices.length; ++i) {
        if (indices[i] !== indices[0]) {
            return false;
        }
    }

    return true;
}

/** Return 'word indices' that included the input indices.
 * Or return an empty array if no suitable indices are found.
 *  
 * Word indices statisfy these conditions:
 * 1) They are sequential.
 * 2) values[x] is non-null (or undefined) for each index value x.
 * 3) They are maximal subject to the other conditions.
 * 
 * This is a help for findWordsContaining.
 */
function findAdjancentIndices(
    values: (BoardSquareData|null)[],

    /** Must be in numerical order */
    indices: number[],
): number[] {

    const usableIndex = (ind: number) => {
        return values[ind] !== null && values[ind] !== undefined;
    };

    let start = indices[0];
    while (usableIndex(start - 1)) {
        --start;
    }

    const result = [];
    for(let ind = start; usableIndex(ind); ++ind) {
        result.push(ind);
    }

    // By construction, results include indices[0].  If results also include
    // the value of indices, then all of indices must be included.
    if(indices[indices.length-1] <= result[result.length-1]) {
        return result;
    }
    
    return [];
}


/** Return a maximal RowCol array that indicate a candidate word
 * that run in the specified direction and includes all of 
 * 'positions'. Or return null if is not possible.
 */ 
function findWordsContaining(
    /** Must be non-empty */
    positions: RowCol[],
  
    board: BoardData,
    direction: Direction,
): RowCol[] | null {
    sAssert(positions.length > 0);

    if (!sameRowCol(positions, direction)) {
        return null;
    }

    if (direction === "row") {
        const row = positions[0].row;
        const array = board[row];
        const indices = positions.map(rc => rc.col);
        const subArray = findAdjancentIndices(array, indices);
        if(subArray.length > 1) {
            return subArray.map(val => rowCol(row, val));
        }
    } 
    
    if (direction === "col") {
        const col = positions[0].col;
        const array = board.map(row => row[col]);
        const indices = positions.map(rc => rc.row);
        const subArray = findAdjancentIndices(array, indices);

        if(subArray.length > 1) {
            return subArray.map(val => rowCol(val, col));
        }
    }

    return null;
}

function findCandidateWordsDirected(
    board: BoardData,
    positions: RowCol[],
    primaryDirection: Direction,
): RowCol[][] | null {
    if(positions.length === 0) {
        return null;
    }

    const mainWord = findWordsContaining(positions, board, primaryDirection);
    if (!mainWord) {
        return null;
    }
 
    const words = [mainWord];

    positions.forEach(rc => {
        const word = findWordsContaining([rc], board,
            otherDirection(primaryDirection)
        );

        if (word) {
            words.push(word);
        }
    });
    return words;
}

/** Return one of the following:
 * 
 * RowCol[][] - Array of candidate words (more precisely array of positions of candidate words).
 * 
 * null - The active letters are in invalid positions (e.g. they don't form all part of the same word).
*/
function findCandidateWords(
    board: BoardData,
    active: RowCol[],
): RowCol[][] | null {

    return findCandidateWordsDirected(board, active, "row") ||
        findCandidateWordsDirected(board, active, "col");
}


interface WordsAndScore {
    words: string[];
    score: number;
  
    /** For later convenience, use null rather than an empty array */
    illegalWords: string[] | null;
  }
  
type ReducedScrabbleContext = Pick<ScrabbleContext, "board" | "config" | "legalWords">

export function getScore(board: BoardData, active: RowCol[], config: ScoringConfig) : number {
    const candidateWords = findCandidateWords(board, active);
    if(!candidateWords) {
        return 0;
    }

    let score = scoreWords(board, candidateWords, config);
    if (active.length === config.rackSize) {
        score += config.allLetterBonus;
    }
    return score;
}

export function getWordsAndScore(context: ReducedScrabbleContext, active: RowCol[]): WordsAndScore | null {
    const candidateWords = findCandidateWords(context.board, active);
    const config = context.config;

    if (!candidateWords) {
        return null;
    }

    const score = getScore(context.board, active, config);

    const words = candidateWords.map(cw => getWord(context.board, cw));
  
    let illegalWords : string[] | null = words.filter(wd => !context.legalWords.hasWord(wd));
    if(illegalWords.length === 0) {
        illegalWords = null;
    }

    return {
        words: words,
        illegalWords: illegalWords,
        score: score,
    };
}