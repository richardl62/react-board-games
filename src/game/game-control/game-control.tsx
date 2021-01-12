import { useState, useRef } from 'react';

import { GameDefinition, SquareProperties, BoardPosition, CorePiece}
    from '../../interfaces';

import * as Bgio from '../../bgio';

import  { CorePieceFactory } from './core-piece';

type PieceID = CorePiece['id'];

type BoardPieces = Array<Array<CorePiece | null>>;

const topLeftBlack = false; // KLUDGE

type DoMove = (id: CorePiece, position: BoardPosition) => void;

function useGameControlProps(gameDefinition: GameDefinition) {

    let corePieceFactory = useRef(new CorePieceFactory()).current;

    return {
        gameDefinition: gameDefinition,
        reverseBoard: useState(false),
        corePieceFactory: corePieceFactory,
    };
}

type GameControlProps = ReturnType<typeof useGameControlProps>;

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
    
    clicked(piece: CorePiece | null, position: BoardPosition | null) {
        // console.log("piece:", piece && piece.id, "position:", position, "_selected:", 
        //     this._selected && this._selected.id);

        if(this._selected === piece) {
            // This same piece has been clicked twice, so cancel the first
            // click.
            this._selected = null;
        } else if(!this._selected) {
            // As there is no _selected piece, we record the current piece.
            // (If piece is null, this implied that an empty square was
            // clicked with no _selected piece. This is OK, but does nothing.)
            this._selected = piece;
        } else if (!position) {
            // An off-board piece has been clicked. It can't be moved so just
            // select it.
            this._selected = piece;
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

    constructor(bgioProps: Bgio.BoardProps, localProps: GameControlProps) {
        this._bgioProps = bgioProps;
        this._localProps = localProps;

        const makeCorePiece = (name:string) => 
            localProps.corePieceFactory.make(name, localProps.gameDefinition.gameType); 

        this._boardPieces = bgioProps.G.pieces.map(row =>
            row.map(name => (name ? makeCorePiece(name) : null))
            );
        
        const offBoard = localProps.gameDefinition.offBoardPieces;
        this._offBoardPieces = {
            top: offBoard ? offBoard.top.map(makeCorePiece) : [],
            bottom: offBoard ? offBoard.bottom.map(makeCorePiece) : [],
        }
        
        const doMove = (piece: CorePiece, position: BoardPosition) => {
            if(this.moveable(piece.id)) {
                this.movePiece(piece.id, position);
            } else {
                this.copyPiece(piece.id, position);
            }
        }
        this._clickManager = new ClickManager(doMove);
    }

    private _bgioProps: Bgio.BoardProps;
    private _localProps: GameControlProps
    private _boardPieces: BoardPieces;
    private _offBoardPieces: {
        top: Array<CorePiece>,
        bottom: Array<CorePiece>,
    }

    private _clickManager: ClickManager;

    private get _boardStyle() { return this._localProps.gameDefinition.boardStyle;}

    undo() { this._bgioProps.undo();}
    redo () { this._bgioProps.redo();}
    restart () { this._bgioProps.reset();}

    get reverseBoardRows() { return this._localProps.reverseBoard[0];}

    flipRowOrder() { this._localProps.reverseBoard[1](!this.reverseBoardRows);}

    get nRows() {
        return this._boardPieces.length;
    }

    get nCols() {
        return this._boardPieces[0].length;
    }

    getPiece(pos: BoardPosition) {
        return this._boardPieces[pos.row][pos.col];
    }

    findPosition(wanted: CorePiece | PieceID ) {

        const wantedId = (typeof wanted === "object") ? wanted.id : wanted;
        for (let row = 0; row < this.nRows; ++row) {
            for (let col = 0; col < this.nCols; ++col) {
                const piece = this.getPiece({ row: row, col: col });
                if (piece && piece.id === wantedId) {
                    return new BoardPosition(row,col);
                }
            }
        }
        
        return null;
    }

    // Find the CorePiece with the given ID.  Throw an error if non is found.
    findCorePiece(wanted: PieceID) {
        // ineffecient.
        const empty: Array<CorePiece|null> = [];
        const allPieces = empty.concat(...this._boardPieces, 
            this._offBoardPieces.top, 
            this._offBoardPieces.bottom);

        const found = allPieces.find(p => p && p.id === wanted);

        if(!found) {
            throw Error("No piece found with ID " + wanted);
        }

        return found;
    }
    
    squareProperties(pos : BoardPosition) : SquareProperties  {

        const { row, col } = pos;
        const isCheckered = this._boardStyle.checkered;
        const asTopLeft = (row + col) % 2 === 0;

        const piece = this.getPiece(pos);
        const clicked = this._clickManager.selected;
        const selected = Boolean(piece && clicked && 
            piece.id === clicked.id);

        //console.log(piece && piece.id, clicked);

        return {
            checkered: this._boardStyle.checkered,
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

    get borderLabels() {return Boolean(this._boardStyle.labels);}

    squareClicked(pos: BoardPosition) {
        this._clickManager.clicked(this.getPiece(pos), pos);
    } 

    pieceClicked(corePiece: CorePiece) {
        this._clickManager.clicked(corePiece, this.findPosition(corePiece));
    }

    clearAll() { this._bgioProps.moves.clearAll(); };

    movePiece (pieceID: PieceID, to: BoardPosition) {
        this.copyPiece(pieceID, to);
        this.clearPiece(pieceID);

        this._clickManager.clear();
    };

    copyPiece (pieceID: PieceID, to: BoardPosition) {
        const piece = this.findCorePiece(pieceID);

        this._bgioProps.moves.add(piece.name, to);    };

    clearPiece (pieceID: PieceID) {
        const from = this.findPosition(pieceID);
        if(!from) {
            throw Error(`Internal error: piece ${pieceID} not found on game board`)
        }
        this._bgioProps.moves.clear(from);
    };

    // Piece on the board are movable. Off-board pieces should be copied.
    moveable (pieceID: PieceID) {
        return Boolean(this.findPosition(pieceID));
    }
}

export default GameControl;
export { useGameControlProps };
