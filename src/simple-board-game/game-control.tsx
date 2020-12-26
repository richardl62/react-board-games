import {  CorePiece, CorePieceFactory } from './core-piece';
import { GameDefinition, SharedGameState} from './internal-interfaces';
import { BoardProps  as BgioBoardProps } from 'boardgame.io/react';

type BgioProps = BgioBoardProps<SharedGameState>;

type BoardPieces = Array<Array<CorePiece | null>>;

interface LocalState {
    reverseBoard: [boolean, (arg: boolean)=>void],
}

interface Position {
    row: number;
    col: number;
}

const topLeftBlack = false; // KLUDGE

class GameControl {

    constructor(gameDefinition: GameDefinition, bgioProps: BgioProps,
        localState: LocalState, corePieceFactory: CorePieceFactory) {
        this._gameDefinition = gameDefinition;
        this._bgioProps = bgioProps;
        this._localState = localState;

        const makeCorePiece = (name:string) => corePieceFactory.make(name, gameDefinition.gameType); 

        this._boardPieces = bgioProps.G.map(row =>
            row.map(name => (name ? makeCorePiece(name) : null))
            );
        
        const offBoard = gameDefinition.offBoardPieces;
        this._offBoardPieces = {
            top: offBoard ? offBoard.top.map(makeCorePiece) : [],
            bottom: offBoard ? offBoard.bottom.map(makeCorePiece) : [],
        }
    }
    private _gameDefinition: GameDefinition;
    private _bgioProps: BgioProps;
    private _localState: LocalState;

    private _boardPieces: BoardPieces;
    private _offBoardPieces: {
        top: Array<CorePiece>,
        bottom: Array<CorePiece>,
    }

    undo() { this._bgioProps.undo();}
    redo () { this._bgioProps.redo();}
    restart () { this._bgioProps.reset();}

    get reverseBoardRows() { return this._localState.reverseBoard[0];}

    flipRowOrder() { this._localState.reverseBoard[1](!this.reverseBoardRows);}

    get nRows() {
        return this._boardPieces.length;
    }

    get nCols() {
        return this._boardPieces[0].length;
    }

    corePiece(row: number, col: number) {
        return this._boardPieces[row][col];
    }

    // const findOffBoardPiece = (pieceId: CorePieceId) => {
    //     // Kludge: p should never be null
    //     let piece = this._stateManager.state.offBoardPiecesTop.find(p => p && p.id === pieceId);
    //     if (!piece) {
    //         piece = this._stateManager.state.offBoardPiecesBottom.find(p => p && p.id === pieceId);
    //     }

    //     return piece;
    // }
    
    findRowAndCol(wanted: CorePiece) {
        for(let row = 0; row < this.nRows; ++row) {
            for(let col = 0; col < this.nCols; ++col) {
                const cp = this.corePiece(row,col);
                if(cp && cp.id === wanted.id) {
                    return {row: row, col: col};
                 }
            }
        }

        return null;
    }

    squareStyle(row: number, col: number) {

        const isCheckered = this._gameDefinition.boardStyle.checkered;
        const asTopLeft = (row + col) % 2 === 0;

        return {
            checkered: this._gameDefinition.boardStyle.checkered,
            black: isCheckered && (asTopLeft ? topLeftBlack : !topLeftBlack),
        };
    }

    offBoardPieces(which : 'top' | 'bottom') {
        let top = which === 'top';
        if(this.reverseBoardRows) {
            top = !top;
        }

        return top ? this._offBoardPieces.top : this._offBoardPieces.bottom;
    }

    get borderLabels() {return Boolean(this._gameDefinition.boardStyle.labels);}

    clearAll() { this._bgioProps.moves.clearAll(); };

    movePiece (piece: CorePiece, to: Position) {
        const from = this.findRowAndCol(piece);
        if(!from) {
            throw Error(`Internal error: piece ${piece.id} not found on game board`)
        }
        this._bgioProps.moves.move(from, to);
    };

    clearPiece (piece: CorePiece) {
        const from = this.findRowAndCol(piece);
        if(!from) {
            throw Error(`Internal error: piece ${piece.id} not found on game board`)
        }
        this._bgioProps.moves.clear(from);
    };

    // Piece on the board are movable. Off-board pieces should be copied.
    moveable (piece: CorePiece) {
        return Boolean(this.findRowAndCol(piece));
    }
}

export { GameControl }
export type { Position }
