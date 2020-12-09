import { useState, useRef } from 'react';
import { BoardLayout } from './board-layout';

import { StateManager } from '../state-manager';
import {  CorePieceFactory, CorePieceId } from './core-piece';
import { GameProps, checkered } from './game-interfaces';


function makeBoardState(layout: GameProps, cpf: CorePieceFactory) {
    const makeCorePiece = (name: string) => cpf.make(name);
    const makeCorePieceOrNull = (name: string | null) => (name ? cpf.make(name) : null);

    const pieces = layout.pieces.map((row: Array<string | null>) => row.map(makeCorePieceOrNull));

    const squarePattern = {
        checkered: layout.style === checkered,
        topLeftBlack: false,
    };
    
    const state = {
        boardLayout: new BoardLayout(pieces, squarePattern),
        copyablePiecesTop: layout.copyablePieces ? layout.copyablePieces.top.map(makeCorePiece) : [],
        copyablePiecesBottom: layout.copyablePieces ? layout.copyablePieces.bottom.map(makeCorePiece) : [],
    };

    return state;
}

type GameState = ReturnType<typeof makeBoardState>;
type MakePiece = (arg0: string) => JSX.Element;

class GameControl {

    private stateManager: StateManager<GameState>;
    private setGameState: (arg: GameState) => void;
    private _reverseBoardRows: boolean;
    private setReverseBoardRows: (arg: boolean) => void;
    private corePieceFactory: CorePieceFactory;
    private _makePiece: MakePiece;
    private _borderLabels: boolean;


    constructor(
        manager: StateManager<GameState>,
        setGameState: (arg: GameState) => void,
        reverseBoardRows: boolean,
        setReverseBoardRows: (arg: boolean) => void,
        corePieceFactory: CorePieceFactory,
        layout: GameProps,
        ) {
        this.stateManager = manager;
        this.setGameState = setGameState;
        this._reverseBoardRows = reverseBoardRows;
        this.setReverseBoardRows = setReverseBoardRows;
        this.corePieceFactory = corePieceFactory;
        this._makePiece = layout.makePiece;
        this._borderLabels = Boolean(layout.borderLabels);
        }


    doSetGameState(newState: Partial<GameState>) {

        this.stateManager.setState(newState);
        this.setGameState(this.stateManager.state);
    }

    get canUndo()  {return this.stateManager.canUndo;}
    get canRedo()  {return this.stateManager.canRedo;}

    undo() { this.setGameState( this.stateManager.undo());}
    redo () { this.setGameState( this.stateManager.redo());}
    restart () { this.setGameState( this.stateManager.restart());}

    get reverseBoardRows() { return this._reverseBoardRows;}

    setBoardLayout (layout: GameProps) {
        this.doSetGameState(makeBoardState(layout, this.corePieceFactory));
    }

    flipRowOrder() { this.setReverseBoardRows(!this.reverseBoardRows);}


    copyablePieces(which : 'top' | 'bottom') {
        let top = which === 'top';
        if(this._reverseBoardRows) {
            top = !top;
        }

        const state = this.stateManager.state;
        return top ? state.copyablePiecesTop : state.copyablePiecesBottom;
    }

    get boardLayout() {return this.stateManager.state.boardLayout;}

    get borderLabels() {return this._borderLabels;}

    makePiece(name: string) {return this._makePiece(name);}

    clear () {
        this.doSetGameState({
            boardLayout: this.stateManager.state.boardLayout.copy().clearSquares()
        });
    };

    movePiece (pieceId: CorePieceId, row: number, col: number) {

        const findOffBoardPiece = (pieceId: CorePieceId) => {
            // Kludge: p should never be null
            let piece = this.stateManager.state.copyablePiecesTop.find(p => p && p.id === pieceId);
            if (!piece) {
                piece = this.stateManager.state.copyablePiecesBottom.find(p => p && p.id === pieceId);
            }
    
            return piece;
        }

        let newBoardLayout = this.stateManager.state.boardLayout.copy();

        const bp = newBoardLayout.findCorePiecebyId(pieceId);
        if (bp) {
            if (row !== bp.row || col !== bp.col) {
                newBoardLayout.setCorePiece(row, col, bp.piece);
                newBoardLayout.setCorePiece(bp.row, bp.col, null);
                this.doSetGameState({ boardLayout: newBoardLayout, });
            }
        } else {
            let obp = findOffBoardPiece(pieceId);

            if (!obp) {
                throw new Error(`Piece with id ${pieceId} not found`);
            }

            const copiedPiece = this.corePieceFactory.copy(obp);
            newBoardLayout.setCorePiece(row, col, copiedPiece);
            this.doSetGameState({ boardLayout: newBoardLayout, });
        }
    };

    dragEnd (pieceId: CorePieceId, dropped: boolean) {
        if (!dropped) {
            // The piece was dragged off the board. Now clear it.
            const bp = this.stateManager.state.boardLayout.findCorePiecebyId(pieceId);
            if (bp) {
                let newBoardLayout = this.stateManager.state.boardLayout.copy();
                newBoardLayout.setCorePiece(bp.row, bp.col, null);

                this.doSetGameState({
                    boardLayout: newBoardLayout,
                })
            }
        }
    };

    dragBehaviour (pieceId: CorePieceId) {
        const onBoard = Boolean(this.stateManager.state.boardLayout.findCorePiecebyId(pieceId));

        return {
            move: onBoard,
            copy: !onBoard,
        };
    }
}

function useGameControl(layout: GameProps) {
    let corePieceFactory = useRef(new CorePieceFactory()).current;
    const [gameState, setGameState] = useState(makeBoardState(layout, corePieceFactory));
    let stateManager = useRef(new StateManager(gameState)).current;

    const [reverseBoardRows, setReverseBoardRows] = useState(false);
    return new GameControl(stateManager, setGameState, reverseBoardRows, setReverseBoardRows, corePieceFactory, layout); 
}

export { GameControl, useGameControl }
