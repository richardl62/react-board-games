import { RowCol, makeRowCol, PiecePosition, samePiecePosition} from '../piece-position';
import { OffBoardPieces } from './game-definition';
import { GameState } from '../../../bgio-tools';

class MoveControl<GameSpecificState = never> {
    constructor(offBoardPieces: OffBoardPieces, state: GameState, activePlayer: number) {
        this._offBoardPieces = offBoardPieces;
        this._state = state;
        this._activePlayer = activePlayer;

    }
    private _offBoardPieces: OffBoardPieces;
    private _state: GameState<GameSpecificState>;
    private _activePlayer: number;

    get state() {
        return this._state;
    }
    
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

    get gameSpecificState(): GameSpecificState {
        // Not sure if this is necessary other than to keep typescript happy.
        if(this._state.gameSpecific === undefined) {
            throw new Error("Game specific state is not available");
        }
        return this._state.gameSpecific;
    }


    set gameSpecificState(state: GameSpecificState) {
        // Not sure if this is necessary
        if(this._state.gameSpecific === undefined) {
            throw new Error("Game specific state is not available");
        }
        this._state.gameSpecific = state;
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

    // Return undefined if the position is invalid
    pieceUnchecked(pos: PiecePosition): undefined | null | string {
        if (makeRowCol(pos)) {
            const row = this._state.pieces[pos.row!];
            return row && row[pos.col!];
        } else if(pos.top !== undefined) {
            return this._offBoardPieces.top[pos.top];
        } else if(pos.bottom !== undefined) {
            return this._offBoardPieces.bottom[pos.bottom];
        }
    }
    
    validPosition(pos: PiecePosition) {
        return this.pieceUnchecked(pos) !== undefined;
    }

    // Throw an exception if the position is invalid.
    piece(pos: PiecePosition): null | string {
        const raw = this.pieceUnchecked(pos);
        if(raw === undefined) {
            throw new Error("Invalid piece position");
        }
        return raw;
    }

    // For now at least off-board pieces cannot be changed.
    setPiece(pos: RowCol, val : string | null) {
        if(!this.validPosition(pos)) {
            throw Error("Invalid position passed to setPiece");
        }
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

export default MoveControl
