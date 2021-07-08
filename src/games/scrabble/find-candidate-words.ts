import assert from "../../shared/assert";
import { BoardData } from "./game-data";

interface RowCol {
    row: number;
    col: number;
}

function rowCol(row: number, col: number) {
    return {row: row, col: col};
}
type Direction = 'row' | 'col';

function otherDirection(dir : Direction) : Direction {
    return dir === 'row' ? 'col' : 'row';
}


export function makeString(    
    positions: RowCol[],
    board: BoardData,
) : string {

    const letters = positions.map(rc => {
        const td = board[rc.row][rc.col];
        assert(td);
        return td.letter;
    });
    return "".concat(...letters);
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
    values: any[],

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

    let result = [];
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
    positions: RowCol[],
    board: BoardData,
    direction: Direction,
): RowCol[] | null {
    if (!sameRowCol(positions, direction)) {
        return null;
    }

    if (direction === 'row') {
        const row = positions[0].row;
        const array = board[row];
        const indices = positions.map(rc => rc.col);
        const subArray = findAdjancentIndices(array, indices);
        if(subArray.length > 1) {
            return subArray.map(val => rowCol(row, val));
        }
    } 
    
    if (direction === 'col') {
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

    let mainWord = findWordsContaining(positions, board, primaryDirection);
    if (!mainWord) {
        return null;
    }
 
    let words = [mainWord];

    positions.forEach(rc => {
        const word = findWordsContaining([rc], board,
            otherDirection(primaryDirection)
        );

        if (word) {
            words.push(word)
        }
    })
    return words;
}

export function findCandidateWords(board: BoardData): RowCol[][] | null {

    let active: RowCol[] = [];

    for (let row = 0; row < board.length; ++row) {
        for (let col = 0; col < board[row].length; ++col) {
            if (board[row][col]?.active) {
                active.push(rowCol(row, col));
            }
        }
    }

    const words = 
        findCandidateWordsDirected(board, active, 'row') ||
        findCandidateWordsDirected(board, active, 'col')
    
    return words;
}