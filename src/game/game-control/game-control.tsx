import { useState } from 'react';

import { GameDefinition, PiecePosition, PieceName}
    from '../../interfaces';

import * as Bgio from '../../bgio';
import { ClickManager } from './click-manager';

const topLeftBlack = false; // KLUDGE

function useGameControlProps(gameDefinition: GameDefinition) {

    return {
        gameDefinition: gameDefinition,
        reverseBoard: useState(false),
    };
}

type GameControlProps = ReturnType<typeof useGameControlProps>;

type SquareBackground = null | 'plain' | 'checkered-white' | 'checkered-black';

interface SquareProperties {
    background: SquareBackground;

    pieceName: PieceName | null;
    changeable: boolean;
    
    gameStatus: {
        // At most one of the booleans below will be true.
        // For games that specify legal moves exactly one will be true.
        selected: boolean;
        canMoveTo: boolean;
        cannotMoveTo: boolean;
    }
}

class GameControl {

    constructor(bgioProps: Bgio.BoardProps, localProps: GameControlProps) {
        this._bgioProps = bgioProps;
        this._localProps = localProps;

        this._clickManager = new ClickManager({
            getSelectedSquare: () => bgioProps.G.selectedSquare,
            setSelectedSquare: (p: PiecePosition|null) => this._setSelectedSquare(p),
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

    private get _bgioMoves() {return this._bgioProps.moves;}

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

        const clickedPos = this._clickManager.selected;
        const selected = Boolean(clickedPos && PiecePosition.same(pos, clickedPos));  

        const legalMoves = this._bgioProps.G.legalMoves;
        const canMoveTo = Boolean(clickedPos && legalMoves 
            && legalMoves[pos.row][pos.col]);

        const cannotMoveTo = Boolean(clickedPos && legalMoves 
            &&!selected && !legalMoves[pos.row][pos.col]);

        const background = () => {
            if(!pos.onBoard) {
                return null;
            } else if(!this.boardStyle.checkered) {
                return 'plain';
            } else {
                const asTopLeft = (pos.row + pos.col) % 2 === 0;
                return(asTopLeft === topLeftBlack) ? 'checkered-black' : 'checkered-white';
            }
        }
        return {
            background: background(),

            pieceName: pieceName(),
            changeable: pos.onBoard,

            gameStatus: {
                selected: selected,
                canMoveTo: canMoveTo,
                cannotMoveTo: cannotMoveTo,
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

    private _setSelectedSquare (p: PiecePosition | null) {
        this._bgioMoves.setSelectedSquare(p,
            this._localProps.gameDefinition.legalMoves
            );
    }

    clearAll() { this._bgioMoves.clearAll(); };

    // Process a user request - by drag or clicks - to move a piece.
    movePieceRequest(from: PiecePosition, to: PiecePosition | null) {
        //console.log("Move request", from.props, to && to.props);


        const toProps = to && this.squareProperties(to);
        const fromProps = this.squareProperties(from);


        if (toProps && !toProps.gameStatus.cannotMoveTo) {
            if (toProps && toProps.changeable) {
                if (fromProps.changeable) {
                    this._bgioMoves.movePiece(from, to);
                } else {
                    this._bgioMoves.setPiece(to, fromProps.pieceName);
                }
            } else {
                // A piece has been dragged or click-moved somewhere if won't go,
                // i.e. off the board. Treat this as a request to clear the piece.
                if (fromProps.changeable) {
                    this._bgioMoves.setPiece(from, null);
                }
            }

            this._clickManager.clear();
        }
    }
}

export {GameControl as default, useGameControlProps};
export type {SquareProperties, SquareBackground}
