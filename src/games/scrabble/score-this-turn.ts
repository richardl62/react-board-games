import { TileData } from "./game-data";

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

function inSameLine(positions: RowCol[], direction: Direction) {
    const indices = positions.map(rc => rc[direction]);
    for (let i = 1; i < indices.length; ++i) {
        if (indices[i] !== indices[0]) {
            return false;
        }

        return true;
    }
}

function findWordContainingHelper(
    /** Part of the board.  */
    squares: (TileData | null)[],

    /** Must be in numerical order */
    indices: number[],
) : number[] | null {

    let start = indices[0];
    while(squares[start-1]) {
        --start;
    }

    let end = indices[0];
    while(squares[end+1]) {
        ++end;
    }

    if(start === end || indices[indices.length-1] > end) {
        return null;
    }
    
    let result = [];
    for(let i = start; i <= end; ++i) {
        result.push(i);
    }

    return result;
}

function findWordContaining(
    positions: RowCol[],
    board: (TileData | null)[][],
    direction: Direction,
): RowCol[] | null {

    if (inSameLine(positions, direction)) {
        if (direction === 'row') {
            const row = positions[0].row;
            const array = board[row];
            const indices = positions.map(rc => rc.col);
            const subArray = findWordContainingHelper(array, indices);
            return subArray && subArray.map(val => rowCol(row, val));
        } else {
            const col = positions[0].row;
            const array = board.map(row => row[col]);
            const indices = positions.map(rc => rc.row);
            const subArray = findWordContainingHelper(array, indices);
            return subArray && subArray.map(val => rowCol(val, col));
        }
    }

    return null;
}

function findWords(
    board: (TileData | null)[][],
    positions: RowCol[],
    primaryDirection: Direction,
): RowCol[][] | null {

    const secondaryDirection = otherDirection(primaryDirection);

    let mainWord = findWordContaining(positions, board, primaryDirection);
    if (mainWord) {
        let words = [mainWord];

        positions.forEach(rc => {
            const word = findWordContaining([rc], board, secondaryDirection);
            if (word) {
                words.push(word)
            }
        })
        return words;
    }

    return null;
}

export function scoreThisTurn(board: (TileData | null)[][]): number | null {

    let active: RowCol[] = [];

    for (let row = 0; row < board.length; ++row) {
        for (let col = 0; col < board[row].length; ++col) {
            if (board[row][col]?.active) {
                active.push(rowCol(row, col));
            }
        }
    }

    const words = findWords(board, active, 'row') ||
        findWords(board, active, 'col');


    console.log('scoreThisTurn', ...(words || []));
    
    return words && words.length; // For now
}