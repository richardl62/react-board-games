import { useState, useRef } from 'react';
import {  CorePiece, CorePieceFactory } from './core-piece';
import { GameProps, SharedGameState, checkered } from './game-interfaces';
import { BoardProps  as BgioBoardProps } from 'boardgame.io/react';
type BgioProps = BgioBoardProps<SharedGameState>;

function useGameHooks() {
    return {
        reverseBoardState: useState(false), 
        corePieceFactory: useRef(new CorePieceFactory()).current,
    };
}

type GameHooks = ReturnType<typeof useGameHooks>;

type BoardPieces = Array<Array<CorePiece | null>>;

interface Position {
    row: number;
    col: number;
}

const topLeftBlack = false; // KLUDGE

class GameControl {

    constructor(gameHooks: GameHooks, gameProps: GameProps, bgioProps: BgioProps) {
        this._gameHooks = gameHooks;
        this._gameProps = gameProps;
        this._bgioProps = bgioProps;

        const makeCorePiece = (name:string) => gameHooks.corePieceFactory.make(name); 

        this._boardPieces = bgioProps.G.map(row =>
            row.map(name => (name ? makeCorePiece(name) : null))
            );
        
        const copyable = gameProps.copyablePieces;
        this._copyablePieces = {
            top: copyable ? copyable.top.map(makeCorePiece) : [],
            bottom: copyable ? copyable.bottom.map(makeCorePiece) : [],
        }
    }

    private _gameHooks: GameHooks;
    private _gameProps: GameProps;
    private _bgioProps: BgioProps;
    private _boardPieces: BoardPieces;
    private _copyablePieces: {
        top: Array<CorePiece>,
        bottom: Array<CorePiece>,
    }

    undo() { this._bgioProps.undo();}
    redo () { this._bgioProps.redo();}
    restart () { this._bgioProps.reset();}

    get reverseBoardRows() { return this._gameHooks.reverseBoardState[0];}

    flipRowOrder() { this._gameHooks.reverseBoardState[1](!this.reverseBoardRows);}

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
    //     let piece = this._stateManager.state.copyablePiecesTop.find(p => p && p.id === pieceId);
    //     if (!piece) {
    //         piece = this._stateManager.state.copyablePiecesBottom.find(p => p && p.id === pieceId);
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

        const isCheckered = this._gameProps.style === checkered;
        const asTopLeft = (row + col) % 2 === 0;

        return {
            checkered: this._gameProps.style === checkered,
            black: isCheckered && (asTopLeft ? topLeftBlack : !topLeftBlack),
        };
    }

    copyablePieces(which : 'top' | 'bottom') {
        let top = which === 'top';
        if(this.reverseBoardRows) {
            top = !top;
        }

        return top ? this._copyablePieces.top : this._copyablePieces.bottom;
    }

    get borderLabels() {return Boolean(this._gameProps.borderLabels);}

    makePiece(cp: CorePiece) {return this._gameProps.makePiece(cp.name);}

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

export { GameControl, useGameHooks }
export type { Position }
