import { useState, useRef } from 'react';
import {  CorePiece, CorePieceFactory, CorePieceId } from './core-piece';
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

//type MakePiece = (arg0: string) => JSX.Element;

type BoardPieces = Array<Array<CorePiece | null>>;

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

    get canUndo() {return true; /* KLUDGE */ }
    get canRedo() {return true; /* KLUDGE */ }

    undo() { this._bgioProps.undo();}
    redo () { this._bgioProps.redo();}
    restart () { /* KLUDGE */ }

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

    makePiece(name: string) {return this._gameProps.makePiece(name);}


    clear () { this._bgioProps.moves.clear(); };

    movePiece (pieceId: CorePieceId, row: number, col: number) {
        /* KLUDGE*/ 
    };

    clearPiece (pieceId: CorePieceId) {
        this._bgioProps.moves.clear();
    };

    // Piece on the board are movable. Off-board pieces should be copied.
    moveable (pieceId: CorePieceId) {
        return true; /* KLUDGE*/ 
    }
}

export { GameControl, useGameHooks }
