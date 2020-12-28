import { BoardProps  as BgioBoardProps } from 'boardgame.io/react';
import { GameDefinition, SharedGameState, BoardPosition } from '../../interfaces';
import CorePiece, { CorePieceFactory } from './core-piece';
type CorePieceID = CorePiece['id'];

type BgioProps = BgioBoardProps<SharedGameState>;

type BoardPieces = Array<Array<CorePiece | null>>;

interface LocalState {
    reverseBoard: [boolean, (arg: boolean)=>void],
}


const topLeftBlack = false; // KLUDGE

class GameControl {

    constructor(gameDefinition: GameDefinition, bgioProps: BgioProps,
        localState: LocalState, corePieceFactory: CorePieceFactory) {
        this._gameDefinition = gameDefinition;
        this._bgioProps = bgioProps;
        this._localState = localState;

        const makeCorePiece = (name:string) => corePieceFactory.make(name, gameDefinition.gameType); 

        this._boardPieces = bgioProps.G.pieces.map(row =>
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

    findRowAndCol(wanted: CorePieceID) {
        for(let row = 0; row < this.nRows; ++row) {
            for(let col = 0; col < this.nCols; ++col) {
                const cp = this.corePiece(row,col);
                if(cp && cp.id === wanted) {
                    return {row: row, col: col};
                 }
            }
        }

        return null;
    }
    private _findCorePiece(wanted: CorePieceID) {
        // ineffecient.
        const empty: Array<CorePiece|null> = [];
        const allPieces = empty.concat(...this._boardPieces, 
            this._offBoardPieces.top, 
            this._offBoardPieces.bottom);

        return allPieces.find(p => p && p.id === wanted);
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

    movePiece (pieceID: CorePieceID, to: BoardPosition) {
        this.copyPiece(pieceID, to);
        this.clearPiece(pieceID);
    };

    copyPiece (pieceID: CorePieceID, to: BoardPosition) {
        const corePiece = this._findCorePiece(pieceID);
        if(!corePiece) {
            throw Error("No piece found with ID " + pieceID);
        }
    
        this._bgioProps.moves.add(corePiece.name, to);
    };

    clearPiece (pieceID: CorePieceID) {
        const from = this.findRowAndCol(pieceID);
        if(!from) {
            throw Error(`Internal error: piece ${pieceID} not found on game board`)
        }
        this._bgioProps.moves.clear(from);
    };

    // Piece on the board are movable. Off-board pieces should be copied.
    moveable (pieceID: CorePieceID) {
        return Boolean(this.findRowAndCol(pieceID));
    }
}

export default GameControl
