import { BoardProps as BgioBoardProps } from 'boardgame.io/react';
import { GameDefinition, SharedGameState, SquareProperties, BoardPosition,
     } from '../../interfaces';
import CorePiece, { CorePieceFactory } from './core-piece';
type CorePieceID = CorePiece['id'];

type BgioProps = BgioBoardProps<SharedGameState>;

type BoardPieces = Array<Array<CorePiece | null>>;

interface LocalState {
    reverseBoard: [boolean, (arg: boolean)=>void],
}

const topLeftBlack = false; // KLUDGE

type DoMove = (id: CorePiece, position: BoardPosition) => void;

// KLUDGE: The click strategy is a bit messy.
class ClickManager {
    // A piece that has been selected by a first click and is available to
    // move on a second click.
    private _selected: CorePiece | null;
 
    private _doMove: DoMove;

    constructor(doMove: DoMove) {
        this._selected = null;
        this._doMove = doMove;
    }

    get selected() {return this._selected;}
    
    clicked(cp: CorePiece | null, position: BoardPosition | null) {
        // console.log("cp:", cp && cp.id, "position:", position, "_selected:", 
        //     this._selected && this._selected.id);

        if(this._selected === cp) {
            // This same piece has been clicked twice, so cancel the first
            // click.
            this._selected = null;
        } else if(!this._selected) {
            // As there is no _selected piece, we record the current piece.
            // (If cp is null, this implied that an empty square was
            // clicked with no _selected piece. This is OK, but does nothing.)
            this._selected = cp;
        } else if (!position) {
            // An off-board piece has been clicked. It can't be moved so just
            // select it.
            this._selected = cp;
        }
        else if(this._selected && position) {
            // An on-board square this been clicked after a piece was _selected.
            // So it's time to make move.
            this._doMove(this._selected, position);
            this._selected = null;
        } else {
            // Should never happen
            throw new Error("Cannot process user clicks");
        }
    }

    clear() {
        this._selected = null;
    }
};

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
        
        const doMove = (cp: CorePiece, position: BoardPosition) => {
            if(this.moveable(cp.id)) {
                this.movePiece(cp.id, position);
            } else {
                this.copyPiece(cp.id, position);
            }
        }
        this._clickManager = new ClickManager(doMove);
    }
    private _gameDefinition: GameDefinition;
    private _bgioProps: BgioProps;
    private _localState: LocalState;

    private _boardPieces: BoardPieces;
    private _offBoardPieces: {
        top: Array<CorePiece>,
        bottom: Array<CorePiece>,
    }
    private _clickManager: ClickManager;
    
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

    corePiece(pos: BoardPosition) {
        return this._boardPieces[pos.row][pos.col];
    }

    findPosition(wanted: CorePiece | CorePieceID ) {

        const wantedId = (typeof wanted === "object") ? wanted.id : wanted;
        for (let row = 0; row < this.nRows; ++row) {
            for (let col = 0; col < this.nCols; ++col) {
                const cp = this.corePiece({ row: row, col: col });
                if (cp && cp.id === wantedId) {
                    return { row: row, col: col };
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
    
    squareProperties(pos : BoardPosition) : SquareProperties  {

        const {row, col } = pos;
        const isCheckered = this._gameDefinition.boardStyle.checkered;
        const asTopLeft = (row + col) % 2 === 0;

        const cp = this.corePiece(pos);
        const clicked = this._clickManager.selected;
        const selected = Boolean(cp && clicked && 
            cp.id === clicked.id);

        return {
            checkered: this._gameDefinition.boardStyle.checkered,
            black: isCheckered && (asTopLeft ? topLeftBlack : !topLeftBlack),
            selected: selected,

            canMoveTo: col === 0, // For now
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

    squareClicked(pos: BoardPosition) {
        this._clickManager.clicked(this.corePiece(pos), pos);
    } 

    pieceClicked(corePiece: CorePiece) {
        this._clickManager.clicked(corePiece, this.findPosition(corePiece));
    }

    clearAll() { this._bgioProps.moves.clearAll(); };

    movePiece (pieceID: CorePieceID, to: BoardPosition) {
        this.copyPiece(pieceID, to);
        this.clearPiece(pieceID);

        this._clickManager.clear();
    };

    copyPiece (pieceID: CorePieceID, to: BoardPosition) {
        const corePiece = this._findCorePiece(pieceID);
        if(!corePiece) {
            throw Error("No piece found with ID " + pieceID);
        }
    
        this._bgioProps.moves.add(corePiece.name, to);
    };

    clearPiece (pieceID: CorePieceID) {
        const from = this.findPosition(pieceID);
        if(!from) {
            throw Error(`Internal error: piece ${pieceID} not found on game board`)
        }
        this._bgioProps.moves.clear(from);
    };

    // Piece on the board are movable. Off-board pieces should be copied.
    moveable (pieceID: CorePieceID) {
        return Boolean(this.findPosition(pieceID));
    }
}

export default GameControl
