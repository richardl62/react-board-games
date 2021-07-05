import { TileData } from "./game-data";
import { letterScore } from "./letter-properties";

interface RowCol {
    row: number;
    col: number;
}

function rowCol(row: number, col: number) : RowCol {
    return {row:row, col:col};
}

function allEqual(arr: any[]) {
    for(let i = 1; i < arr.length; ++i) {
        if(arr[i] !== arr[0]) {
            return false;
        }
    }

    return true;
} 

function scoreWord(indices: number[], squares: (TileData | null)[]) : number | null {
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

    let score = 0;
    for(let ind = start; ind <= end; ++ind) {
        score += letterScore(squares[ind]!.letter);
    }
    
    return score;
}

function scoreWordSameRow(tiles: RowCol[], board: (TileData | null)[][]) : number | null {
    const row = tiles[0].row;
    const squares = board[row];
    const indices = tiles.map(rc => rc.col);

    return scoreWord(indices, squares);
}

function scoreWordSameCol(tiles: RowCol[], board: (TileData | null)[][]) : number | null {
    const col = tiles[0].col;
    const squares = board.map(row => row[col]);
    const indices = tiles.map(rc => rc.row);

    return scoreWord(indices, squares);
}


export function scoreThisTurn(board: (TileData | null)[][]) : number|null {

    let active : RowCol[] = [];

    for(let row = 0; row < board.length; ++row) {
        for(let col = 0; col < board[row].length; ++col) {
            if(board[row][col]?.active) {
                active.push(rowCol(row, col));
            }
        }
    }
    let score;
    
    if( active.length === 0) {
        score = 0;
    } else if(allEqual(active.map(rc => rc.row))) {
        score = scoreWordSameRow(active, board);
    } else if(allEqual(active.map(rc => rc.col))) {
        score = scoreWordSameCol(active, board);
    } else {
        score = null;
    }
    return score;
}