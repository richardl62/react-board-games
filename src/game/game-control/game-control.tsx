import { useState, useRef } from 'react';

import { GameDefinition, SquareProperties, BoardPosition, CorePiece}
    from '../../interfaces';

import * as Bgio from '../../bgio';


type BoardPieces = Array<Array<CorePiece | null>>;

const topLeftBlack = false; // KLUDGE

type DoMove = (from: BoardPosition, to: BoardPosition) => void;

function useGameControlProps(gameDefinition: GameDefinition) {

    return {
        gameDefinition: gameDefinition,
        reverseBoard: useState(false),
    };
}

type GameControlProps = ReturnType<typeof useGameControlProps>;

interface PositionStatus {
    moveablePiece: boolean;
    empty: boolean;
}

// KLUDGE: The click strategy is a bit messy.
class ClickManager {
    // A piece that has been selected by a first click and is available to
    // move on a second click.
    private _selected: BoardPosition | null;
 
    private _doMove: DoMove;

    constructor(doMove: DoMove) {
        this._selected = null;
        this._doMove = doMove;
    }

    get selected() {return this._selected;}
    
    clicked(pos: BoardPosition, positionStatus: PositionStatus) {
        if (this._selected) {
            if(BoardPosition.same(this._selected, pos)) {
                // This same square has been clicked twice. Cancel the first click.
                this._selected = null;
            } else {
                this._doMove(this._selected, pos);
                this._selected = null;
            }
        } else {
            // No square is currently selected.
            if (positionStatus.empty) {
                // An empty square is clicked with nothing selected. Do nothing.
            } else {
                this._selected = pos;
            }
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

        const makeCorePiece = (name:string) => {
            return {
                name:name, 
                gameType:localProps.gameDefinition.gameType};
        } 

        this._boardPieces = bgioProps.G.pieces.map(row =>
            row.map(name => (name ? makeCorePiece(name) : null))
            );
        
        const offBoard = localProps.gameDefinition.offBoardPieces;
        this._offBoardPieces = {
            top: offBoard ? offBoard.top.map(makeCorePiece) : [],
            bottom: offBoard ? offBoard.bottom.map(makeCorePiece) : [],
        }
        
        const doMove = (from: BoardPosition, to: BoardPosition) => {
            if(this.positionStatus(from).moveablePiece) {
                this.movePiece(from, to);
            } else {
                this.copyPiece(from, to);
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
    
    squareProperties(pos : BoardPosition) : SquareProperties  {

        const { row, col } = pos;
        const isCheckered = this._boardStyle.checkered;
        const asTopLeft = (row + col) % 2 === 0;

        // const piece = this.getPiece(pos);
        // const clicked = this._clickManager.selected;
        const selected = false; // KLUDGE - was Boolean(piece && clicked && 
        //     piece.id === clicked.id);

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
        this._clickManager.clicked(pos, this.positionStatus(pos));
    } 


    clearAll() { this._bgioProps.moves.clearAll(); };

    movePiece (from: BoardPosition, to: BoardPosition) {
        this.copyPiece(from, to);
        this.clearPiece(from);

        this._clickManager.clear();
    };

    copyPiece (from: BoardPosition, to: BoardPosition) {
        const piece = this.getPiece(from);
        if(!piece) {
            throw new Error("Oops");
        }
        this._bgioProps.moves.add(piece.name, to);    
    };

    clearPiece(from: BoardPosition) {
        this._bgioProps.moves.clear(from);
    };

    // Piece on the board are movable. Off-board pieces should be copied.
    positionStatus(from: BoardPosition) : PositionStatus {
        const onBoard = Boolean(this.getPiece(from));
        return {
            moveablePiece: onBoard,
            empty: !onBoard, // Kludge - just for now.
        }
    }
}

export default GameControl;
export { useGameControlProps };
