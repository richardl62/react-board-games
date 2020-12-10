import { useState, useRef } from 'react';
import { BoardLayout } from './board-layout';

import { StateManager } from '../state-manager';
import {  CorePieceFactory, CorePieceId } from './core-piece';
import { GameProps, checkered, SharedGameState } from './game-interfaces';
import { BoardProps  as BgioBoardProps } from 'boardgame.io/react';
type BgioProps = BgioBoardProps<SharedGameState>;

function makeBoardState(gameProps: GameProps, cpf: CorePieceFactory) {
    const makeCorePiece = (name: string) => cpf.make(name);
    const makeCorePieceOrNull = (name: string | null) => (name ? cpf.make(name) : null);

    const pieces = gameProps.pieces.map((row: Array<string | null>) => row.map(makeCorePieceOrNull));

    const squarePattern = {
        checkered: gameProps.style === checkered,
        topLeftBlack: false,
    };
    
    const state = {
        boardLayout: new BoardLayout(pieces, squarePattern),
        copyablePiecesTop: gameProps.copyablePieces ? gameProps.copyablePieces.top.map(makeCorePiece) : [],
        copyablePiecesBottom: gameProps.copyablePieces ? gameProps.copyablePieces.bottom.map(makeCorePiece) : [],
    };

    return state;
}

type GameState = ReturnType<typeof makeBoardState>;
type MakePiece = (arg0: string) => JSX.Element;

interface GameControlParams {
    manager: StateManager<GameState>;
    setGameState: (arg: GameState) => void;
    reverseBoardRows: boolean;
    setReverseBoardRows: (arg: boolean) => void;
    corePieceFactory: CorePieceFactory;
    gameProps: GameProps;
};

class GameControl {

    private _stateManager: StateManager<GameState>;
    private _setGameState: (arg: GameState) => void;
    private _reverseBoardRows: boolean;
    private _setReverseBoardRows: (arg: boolean) => void;
    private _corePieceFactory: CorePieceFactory;
    private _makePiece: MakePiece;
    private _borderLabels: boolean;
    private _bgioProps: BgioProps;


    constructor(params: GameControlParams, bgioProps: BgioProps) {
        this._stateManager = params.manager;
        this._setGameState = params.setGameState;
        this._reverseBoardRows = params.reverseBoardRows;
        this._setReverseBoardRows = params.setReverseBoardRows;
        this._corePieceFactory = params.corePieceFactory;
        this._makePiece = params.gameProps.makePiece;
        this._borderLabels = Boolean(params.gameProps.borderLabels);
        this._bgioProps = bgioProps;    
    }


    private _doSetGameState(newState: Partial<GameState>) {

        this._stateManager.setState(newState);
        this._setGameState(this._stateManager.state);
    }

    get canUndo()  {return this._stateManager.canUndo;}
    get canRedo()  {return this._stateManager.canRedo;}

    undo() { this._setGameState( this._stateManager.undo());}
    redo () { this._setGameState( this._stateManager.redo());}
    restart () { this._setGameState( this._stateManager.restart());}

    get reverseBoardRows() { return this._reverseBoardRows;}

    setBoardLayout (gameProps: GameProps) {
        this._doSetGameState(makeBoardState(gameProps, this._corePieceFactory));
    }

    flipRowOrder() { this._setReverseBoardRows(!this.reverseBoardRows);}


    copyablePieces(which : 'top' | 'bottom') {
        let top = which === 'top';
        if(this._reverseBoardRows) {
            top = !top;
        }

        const state = this._stateManager.state;
        return top ? state.copyablePiecesTop : state.copyablePiecesBottom;
    }

    get boardLayout() {return this._stateManager.state.boardLayout;}

    get borderLabels() {return this._borderLabels;}

    makePiece(name: string) {return this._makePiece(name);}

    clear () {
        this._doSetGameState({
            boardLayout: this._stateManager.state.boardLayout.copy().clearSquares()
        });
    };

    movePiece (pieceId: CorePieceId, row: number, col: number) {

        const findOffBoardPiece = (pieceId: CorePieceId) => {
            // Kludge: p should never be null
            let piece = this._stateManager.state.copyablePiecesTop.find(p => p && p.id === pieceId);
            if (!piece) {
                piece = this._stateManager.state.copyablePiecesBottom.find(p => p && p.id === pieceId);
            }
    
            return piece;
        }

        let newBoardLayout = this._stateManager.state.boardLayout.copy();

        const bp = newBoardLayout.findCorePiecebyId(pieceId);
        if (bp) {
            if (row !== bp.row || col !== bp.col) {
                newBoardLayout.setCorePiece(row, col, bp.piece);
                newBoardLayout.setCorePiece(bp.row, bp.col, null);
                this._doSetGameState({ boardLayout: newBoardLayout, });
            }
        } else {
            let obp = findOffBoardPiece(pieceId);

            if (!obp) {
                throw new Error(`Piece with id ${pieceId} not found`);
            }

            const copiedPiece = this._corePieceFactory.copy(obp);
            newBoardLayout.setCorePiece(row, col, copiedPiece);
            this._doSetGameState({ boardLayout: newBoardLayout, });
        }
    };

    clearPiece (pieceId: CorePieceId) {
        const bp = this._stateManager.state.boardLayout.findCorePiecebyId(pieceId);
        if (bp) {
            let newBoardLayout = this._stateManager.state.boardLayout.copy();
            newBoardLayout.setCorePiece(bp.row, bp.col, null);

            this._doSetGameState({
                boardLayout: newBoardLayout,
            })
        }
    };

    // Piece on the board are movable. Off-board pieces should be copied.
    moveable (pieceId: CorePieceId) {
        return Boolean(this._stateManager.state.boardLayout.findCorePiecebyId(pieceId));
    }
}

function useGameControlSetup(gameProps: GameProps) {
    let corePieceFactory = useRef(new CorePieceFactory()).current;
    const [gameState, setGameState] = useState(makeBoardState(gameProps, corePieceFactory));
    let stateManager = useRef(new StateManager(gameState)).current;
    const [reverseBoardRows, setReverseBoardRows] = useState(false);
    
    return {
        manager: stateManager, 
        setGameState: setGameState, 
        reverseBoardRows: reverseBoardRows, 
        setReverseBoardRows: setReverseBoardRows, 
        corePieceFactory: corePieceFactory,
        gameProps: gameProps,
    };

}

export { GameControl, useGameControlSetup }
