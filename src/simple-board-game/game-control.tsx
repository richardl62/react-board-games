import { useState, useRef } from 'react';
import {  CorePieceFactory, CorePieceId } from './core-piece';
import { GameProps, SharedGameState } from './game-interfaces';
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

class GameControl {

    private _gameHooks: GameHooks;
    private _gameProps: GameProps;
    private _bgioProps: BgioProps;

    constructor(gameHooks: GameHooks, gameProps: GameProps, bgioProps: BgioProps) {
        this._gameHooks = gameHooks;
        this._gameProps = gameProps;
        this._bgioProps = bgioProps;
    }

    get canUndo() {return true; /* KLUDGE */ }
    get canRedo() {return true; /* KLUDGE */ }

    undo() { this._bgioProps.undo();}
    redo () { this._bgioProps.redo();}
    restart () { /* KLUDGE */ }

    get reverseBoardRows() { return this._gameHooks.reverseBoardState[0];}

    flipRowOrder() { this._gameHooks.reverseBoardState[1](!this.reverseBoardRows);}

    copyablePieces(which : 'top' | 'bottom') {
        // let top = which === 'top';
        // if(this.reverseBoardRows) {
        //     top = !top;
        // }

        return [];
    }

    get borderLabels() {return Boolean(this._gameProps.borderLabels);}

    //makePiece(name: string) {return this._makePiece(name);}

    clear () { /* KLUDGE*/ };

    movePiece (pieceId: CorePieceId, row: number, col: number) {
        /* KLUDGE*/ 
    };

    clearPiece (pieceId: CorePieceId) {
        /* KLUDGE*/ 
    };

    // Piece on the board are movable. Off-board pieces should be copied.
    moveable (pieceId: CorePieceId) {
        return true; /* KLUDGE*/ 
    }
}

export { GameControl, useGameHooks }
