import { useState } from 'react';

import { GameDefinition, SquareProperties, PiecePosition, PieceName}
    from '../../interfaces';

import * as Bgio from '../../bgio';

const topLeftBlack = false; // KLUDGE

type DoMove = (from: PiecePosition, to: PiecePosition) => void;

function useGameControlProps(gameDefinition: GameDefinition) {

    return {
        gameDefinition: gameDefinition,
        reverseBoard: useState(false),
    };
}

type GameControlProps = ReturnType<typeof useGameControlProps>;

class PositionStatus {
    pieceName: PieceName | null = null;
    onBoard: boolean = false

    get moveable() {return this.onBoard;}
    get empty() {return !this.pieceName;}
}

class ClickManager {
    // A piece that has been selected by a first click and is available to
    // move on a second click.
    private _selected: PiecePosition | null;
 
    private _doMove: DoMove;

    constructor(doMove: DoMove) {
        this._selected = null;
        this._doMove = doMove;
    }

    get selected() {return this._selected;}
    
    clicked(pos: PiecePosition, positionStatus: PositionStatus) {
        if (this._selected) {
            if(PiecePosition.same(this._selected, pos)) {
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

        const doMove = (from: PiecePosition, to: PiecePosition) => {
            console.log("GC move", from, to);
            if(this.positionStatus(from).moveable) {
                this.movePiece(from, to);
            } else {
                this.copyPiece(from, to);
            }
        }
        this._clickManager = new ClickManager(doMove);
    }

    private _bgioProps: Bgio.BoardProps;
    private _localProps: GameControlProps;
    private _clickManager: ClickManager;

    // Public access to on-board or off-board pieces is though functions that
    // take account of flipping.
    private get _boardPieces() {return this._bgioProps.G.pieces;}
    private get _offBoardPieces() {return this._localProps.gameDefinition.offBoardPieces;}

    get gameType() {return this._localProps.gameDefinition.gameType;}
    get boardStyle() { return this._localProps.gameDefinition.boardStyle;}

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
    
    squareProperties(pos : PiecePosition) : SquareProperties  {
        const isCheckered = this.boardStyle.checkered;
        const asTopLeft = (pos.row + pos.col) % 2 === 0;


        const clickedPos = this._clickManager.selected;
        const selected = Boolean(clickedPos && PiecePosition.same(pos, clickedPos));  

        return {
            checkered: this.boardStyle.checkered,
            black: isCheckered && (asTopLeft ? topLeftBlack : !topLeftBlack),
            selected: selected,

            canMoveTo: false, // For now
        };
    }

    // Piece on the board are movable. Off-board pieces should be copied.
    positionStatus(pos: PiecePosition): PositionStatus {
        let status = new PositionStatus();
        status.onBoard = pos.onBoard;
        if(pos.onBoard) {
            status.pieceName = this._boardPieces[pos.row as number][pos.col as number];
        } else if(pos.onTop) {
            status.pieceName = this._offBoardPieces.top[pos.top];
        } else {
            status.pieceName = this._offBoardPieces.bottom[pos.bottom];
        }
        
        return status;
    }

    offBoardPieces(which : 'top' | 'bottom') {
        let top = which === 'top';
        if(this.reverseBoardRows) {
            top = !top;
        }

        return top ? this._offBoardPieces.top : this._offBoardPieces.bottom;
    }

    squareClicked(pos: PiecePosition) {
        this._clickManager.clicked(pos, this.positionStatus(pos));
    } 

    clearAll() { this._bgioProps.moves.clearAll(); };

    movePiece (from: PiecePosition, to: PiecePosition) {
        if(!from.onBoard) {
            throw new Error("Attempt to move an off-board piece");
        }
        this._bgioProps.moves.movePiece(from, to);
    };

    copyPiece (from: PiecePosition, to: PiecePosition) {
        const pieceName = this.positionStatus(from).pieceName;
        if(!pieceName) {
            throw new Error("Attempt to copy from empty square");
        }
        this._bgioProps.moves.setPiece(to, pieceName);    
    };

    clearPiece(pos: PiecePosition) {
        if(!pos.onBoard) {
            throw new Error("Attempt to clear an off-board piece");
        }
        this._bgioProps.moves.setPiece(pos, null);
    };

    pieceDragged(from: PiecePosition, to: PiecePosition | null) {
        console.log("dragged", from, to);
        if(this.positionStatus(from).moveable && to) {
            this.movePiece(from, to);
        } else if (to) {
            this.copyPiece(from, to);
        } else {
            // A piece has been dragged off the board.
            // (Do nothing if it is not on the board)
            if(from.onBoard) {
                this.clearPiece(from);
            }
        }
    }
}

export default GameControl;
export { useGameControlProps };
