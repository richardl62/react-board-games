import { useState } from 'react';

import { GameDefinition, PiecePosition, PieceName }
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

const rowAndCol = Bgio.rowAndCol;

class GameControl {

    constructor(bgioProps: Bgio.BoardProps, localProps: GameControlProps) {
        this._bgioProps = bgioProps;
        this._localProps = localProps;

        this._clickManager = new ClickManager({
            getSelectedSquare: () => {
                const selected = bgioProps.G.selectedSquare;
                return selected && new PiecePosition(Bgio.unmakePosition(selected));
            },
            setSelectedSquare: (p: PiecePosition | null) => this._setSelectedSquare(p),
            doMove: (p1: PiecePosition, p2: PiecePosition | null) =>
                this.movePieceRequest(p1, p2),
        });
    }

    private _bgioProps: Bgio.BoardProps;
    private _localProps: GameControlProps;
    private _clickManager: ClickManager;

    // Public access to on-board or off-board pieces is though functions that
    // take account of flipping.
    private get _boardPieces() { return this._bgioProps.G.pieces; }
    private get _offBoardPieces() { return this._localProps.gameDefinition.offBoardPieces; }

    private get _bgioMoves() {
        return this._bgioProps.moves as any as Bgio.ClientMoves;
    }

    get gameType() { return this._localProps.gameDefinition.gameType; }
    get boardStyle() { return this._localProps.gameDefinition.boardStyle; }

    undo() { this._bgioProps.undo(); }
    redo() { this._bgioProps.redo(); }
    restart() { 
        this._bgioMoves.setPieces(this._localProps.gameDefinition.pieces);
    }

    get reverseBoardRows() { return this._localProps.reverseBoard[0]; }

    flipRowOrder() { this._localProps.reverseBoard[1](!this.reverseBoardRows); }

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
            && !selected && !legalMoves[pos.row][pos.col]);

        const background = () => {
            if (!pos.onBoard) {
                return null;
            } else if (!this.boardStyle.checkered) {
                return 'plain';
            } else {
                const asTopLeft = (pos.row + pos.col) % 2 === 0;
                return (asTopLeft === topLeftBlack) ? 'checkered-black' : 'checkered-white';
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

    offBoardPieces(which: 'top' | 'bottom') {
        let top = which === 'top';
        if (this.reverseBoardRows) {
            top = !top;
        }

        return top ? this._offBoardPieces.top : this._offBoardPieces.bottom;
    }

    squareClicked(pos: PiecePosition) {
        this._clickManager.clicked(pos, this.squareProperties(pos));
    }

    private _setSelectedSquare(p: PiecePosition | null) {
        const pieces = this._boardPieces;
        const findLegalMoves = this._localProps.gameDefinition.legalMoves;

        let legalMoves = null;
        if (p && findLegalMoves) {

            legalMoves = pieces.map(row => row.map(elem => false));

            findLegalMoves({
                selectedSquare: p,
                pieces: pieces,
                legalMoves: legalMoves,
            });
        }

        this._bgioMoves.setSelectedSquare({
            selected: p && Bgio.makePosition(p.data),
            legalMoves: legalMoves,
        });
    }

    clearAll() { 
        const emptyBoard = this._boardPieces.map(row => row.map(()=>null));
        this._bgioMoves.setPieces(emptyBoard);
     };

    // Process a user request - by drag or clicks - to move a piece.
    movePieceRequest(from: PiecePosition, to: PiecePosition | null) {
        const toProps = to && this.squareProperties(to);
        const fromProps = this.squareProperties(from);

        if (to && toProps && !toProps.gameStatus.cannotMoveTo) {
            if (toProps && toProps.changeable) {
                if (fromProps.changeable) {
                    this._bgioMoves.movePiece({
                        from: rowAndCol(from),
                        to: rowAndCol(to),
                    });
                } else {
                    this._bgioMoves.setPiece({
                        pos: rowAndCol(to),
                        pieceName: fromProps.pieceName
                    });
                }
            } else {
                // A piece has been dragged or click-moved somewhere if won't go,
                // i.e. off the board. Treat this as a request to clear the piece.
                if (fromProps.changeable) {
                    this._bgioMoves.setPiece({
                        pos: rowAndCol(from),
                        pieceName: null
                    });
                }
            }

            this._clickManager.clear();
        }
    }

    get renderPiece() {return this._localProps.gameDefinition.renderPiece;}
}

export { GameControl as default, useGameControlProps };
export type { SquareProperties, SquareBackground }