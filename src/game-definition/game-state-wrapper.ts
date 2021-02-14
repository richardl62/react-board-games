import { RowCol, PiecePosition, samePiecePosition } from '../interfaces';
import { GameState } from './game-definition';

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

    get nextActivePlayer() {
        // KLUDGE: Assumes there are only two players
        return this._activePlayer === 0 ? 1 : 0;
    }

    get selectedSquare() { 
        return this._state.selectedSquare;
    }

    set selectedSquare(pos: PiecePosition | null) { 
        this._state.selectedSquare = pos; 
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
            lm.forEach(row => row.fill(val));
        }
    }

    movePiece(from: RowCol, to: RowCol) {
        if(!samePiecePosition(to, from)) {
            this.setPiece(to, this.piece(from)!);
            this.setPiece(from, null);
        }
    }

    // Return undefined if the piece is off the board
    piece(pos: RowCol): undefined | null | string {
        const row = this._state.pieces[pos.row];
        return row && row[pos.col];
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

export { GameStateWrapper }
