import { useState } from 'react';

import { GameDefinition, PiecePosition, PieceName}
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

interface SquareProperties {
    background: {
        checkered: boolean;
        black: boolean;
    };

    pieceName: PieceName | null;
    changeable: boolean;
    
    gameStatus: {
        selected: boolean;
        canMoveTo: boolean;
    }
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
    
    clicked(pos: PiecePosition, squareProperties: SquareProperties) {
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
            if (!squareProperties.pieceName) {
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
    
    squareProperties(pos: PiecePosition): SquareProperties {

        const pieceName = () => {
            if (pos.onBoard) {
                return this._boardPieces[pos.row as number][pos.col as number];
            } else if (pos.onTop) {
                return this._offBoardPieces.top[pos.top];
            } else if (pos.onBottom) {
                return this._offBoardPieces.bottom[pos.bottom];
            }
            throw new Error("squareProperties cannot find square");
        }


        let black=false;
        if(this.boardStyle.checkered && pos.onBoard) {
            const asTopLeft = (pos.row + pos.col) % 2 === 0;
            black = asTopLeft === topLeftBlack;
        }

        const clickedPos = this._clickManager.selected;
        const selected = Boolean(clickedPos && PiecePosition.same(pos, clickedPos));  

        return {
            background: {
                checkered: this.boardStyle.checkered,
                black: black,
            },

            pieceName: pieceName(),
            changeable: pos.onBoard,

            gameStatus: {
                selected: selected,
                canMoveTo: false, // For now,
            },
        }
    }

    offBoardPieces(which : 'top' | 'bottom') {
        let top = which === 'top';
        if(this.reverseBoardRows) {
            top = !top;
        }

        return top ? this._offBoardPieces.top : this._offBoardPieces.bottom;
    }

    squareClicked(pos: PiecePosition) {
        this._clickManager.clicked(pos, this.squareProperties(pos));
    } 

    clearAll() { this._bgioProps.moves.clearAll(); };

    // Process a user request - by drag or clicks - to move a piece.
    movePieceRequest(from: PiecePosition, to: PiecePosition | null) {
        //console.log("Move request", from.props, to && to.props);
        
        const changeable = (pos : PiecePosition | null) => {
            return pos && this.squareProperties(pos).changeable;
        }

        const pieceName = (pos : PiecePosition | null) => {
            return pos && this.squareProperties(pos).pieceName;
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
