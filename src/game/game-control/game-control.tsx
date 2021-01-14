import { useState } from 'react';

import { GameDefinition, SquareProperties, PiecePosition, PieceName}
    from '../../interfaces';

import * as Bgio from '../../bgio';

const topLeftBlack = false; // KLUDGE

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

function props(p: PiecePosition | null) {
    return p && p.props;
}

interface ClickManagerProps {
    getSelectedSquare: () => PiecePosition | null;
    setSelectedSquare: (arg: PiecePosition | null) => void;
    doMove: (from: PiecePosition, to: PiecePosition | null) => void;
}
class ClickManager {
    // A piece that has been selected by a first click and is available to
    // move on a second click.
    private _props: ClickManagerProps;

    constructor(cmProps: ClickManagerProps) {
        this._props = cmProps;

        //console.log("CM Constructor:", props(this.selected));
    }

    get selected() {
        return this._props.getSelectedSquare();
    }

    private set _selected(val : PiecePosition| null) {
        //console.log("CM set: old", props(this.selected) , "new", props(val));

        this._props.setSelectedSquare(val);;
    }
    
    clicked(pos: PiecePosition, positionStatus: PositionStatus) {
        // console.log("CM clicked: selected", props(this.selected), "clicked", props(pos));
        if (this.selected) {
            if(PiecePosition.same(this.selected, pos)) {
                // This same square has been clicked twice. Cancel the first click.
                this._selected = null;
            } else {
                this._props.doMove(this.selected, pos);
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

        this._clickManager = new ClickManager({
            getSelectedSquare: () => bgioProps.G.selectedSquare,
            setSelectedSquare: (p: PiecePosition | null) => {bgioProps.moves.setSelectedSquare(p)},
            doMove: (p1: PiecePosition, p2: PiecePosition | null) =>
                this.movePieceRequest(p1, p2),
        });
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

    // Process a user request - by drag or clicks - to move a piece.
    movePieceRequest(from: PiecePosition, to: PiecePosition | null) {
        //console.log("Move request", from.props, to && to.props);
        
        const changeable = (pos : PiecePosition | null) => {
            return pos && this.positionStatus(pos).moveable;
        }

        const pieceName = (pos : PiecePosition | null) => {
            return pos && this.positionStatus(pos).pieceName;
        }
        
        if(changeable(to)) {
            if(changeable(from)) {
                this._bgioProps.moves.movePiece(from, to);
            } else {
                this._bgioProps.moves.setPiece(to, pieceName(from));
            }
        } else  {
            // A piece has been dragged or click-moved somewhere if won't go,
            // i.e. off the board. Treat this as a request to clear the piece.
            if(changeable(from)) {
                this._bgioProps.moves.setPiece(from, null);
            }
        }

        this._clickManager.clear();
    }
}

export default GameControl;
export { useGameControlProps };
