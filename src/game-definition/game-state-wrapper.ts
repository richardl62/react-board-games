import { GameState } from './game-definition';
import { nonNull } from '../tools';

interface RowCol {
    row: number;
    col: number;
}

interface RowColArg {
    row?: number, 
    col?: number,

    r?: number,
    c?: number,
};

function rowCol (rc: RowColArg | null ) : RowCol | null {
    return rc && {
        row: (rc.row === undefined) ? nonNull(rc.r) : rc.row,
        col: (rc.col === undefined) ? nonNull(rc.c) : rc.col,
    }
}

function sameRowCol(p1: RowCol, p2: RowCol) {
    return p1.row === p2.row && p1.col === p2.col;
}

class GameStateWrapper {
    constructor(state: GameState, activePlayer: number) {
        this._state = state;
        this._activePlayer = activePlayer;
    }
    private _state: GameState;
    private _activePlayer: number;

    get nRows() { 
        return this._state.pieces.length;
    }

    get nCols() { 
        return this._state.pieces[0].length;
    }

    get activePlayer() {
        return this._activePlayer;
    }

    get selectedSquare()  : RowCol | null { 
        const selected = this._state.selectedSquare;
        return selected && rowCol(selected); 
    }

    set selectedSquare(pos: RowCol | null) { 
        this._state.selectedSquare = pos && {r: pos.row, c: pos.col}; 
    }

    get pieceTypeToMove() : string | null {
        return this._state.pieceTypeToMove;
    }

    set pieceTypeToMove(type : string | null) {
        this._state.pieceTypeToMove = type;
    }

    legalMove(pos: RowCol): boolean | null {
        const lm = this._state.legalMoves;
        return lm && lm[pos.row][pos.col];
    }

    get allMovesIllegal() : boolean {
        const lm = this._state.legalMoves;
        if(!lm) {
            // if legalMoves are not defined, this implied that all moves are
            // legal.
            return false;
        }
        
        const foundTrue = lm.find(row => row.includes(true));
        return foundTrue === undefined;
    }

    setLegalMove(pos: RowCol, val: boolean) {
        const lm = this._state.legalMoves;
        if(!lm) {
            throw new Error("Legal moves are not defined");
        }
        return lm[pos.row][pos.col] = val;
    }

    setAllLegalMoves(val: boolean) {
        let lm = this._state.legalMoves;
        if(lm) {
            lm.forEach(row => row.fill(true));
        }
    }

    movePiece(from: RowCol, to: RowCol) {
        if(!sameRowCol(to, from)) {
            this.setPiece(to, this.piece(from));
            this.setPiece(from, null);
        }
    }

    piece(pos: RowCol) {
        return this._state.pieces[pos.row][pos.col];
    }

    setPiece(pos: RowCol, val : string | null) {
        this._state.pieces[pos.row][pos.col] = val;
    }

    findPieces(name: string) : Array<RowCol> {
        let result = [];

        const pieces = this._state.pieces;
        for(let r = 0; r < pieces.length; ++r) {
            for(let c = 0; c < pieces.length; ++c) {
                if(pieces[r][c] === name) {
                    result.push({row:r, col: c})
                }
            }
        }

        return result;
    }
}

export { GameStateWrapper, rowCol, sameRowCol }
