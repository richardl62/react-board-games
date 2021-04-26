import { useRef, useState } from 'react';
import { BoardProps as BgioBoardPropsTemplate } from 'boardgame.io/react'
import { PiecePosition, samePiecePosition, makePiecePosition } from '../../piece-position';
import { PieceName } from "../piece-name";
import  { GameDefinition, MoveControl, MoveResult } from '../definition';
import { GameState } from '../game-state';
import { ClientMoves } from '../moves';
import HistoryManager from './history-manager';
const topLeftBlack = false; // KLUDGE


type GenericGameState = GameState<any>;
type BgioProps = BgioBoardPropsTemplate<GenericGameState>;

function useGameControlProps(gameDefinition: GameDefinition) {

    return {
        gameDefinition: gameDefinition,
        reverseBoard: useState(false),
        historyManager: useRef(
            new HistoryManager<GenericGameState>(gameDefinition.initialState)
            ).current,
    };
}

type GameControlProps = ReturnType<typeof useGameControlProps>;

type SquareBackground = null | 'plain' | 'checkered-white' | 'checkered-black';

enum LegalMoveStatus {
    Legal,
    Illegal,
    Unknown,
};

interface SquareProperties {
    background: SquareBackground;

    pieceName: PieceName | null;
    changeable: boolean;

    gameStatus: {
        // At most one of the booleans below will be true.
        // For games that specify legal moves exactly one will be true.
        selected: boolean;
        legalMoveStatus: LegalMoveStatus;
    }
}

interface Players {
    // The names of all the players in player order.
    playerNames: Array<string>;

    // The number of player who made the call (or, at least whose client did).
    // (Index into playerNames)
    caller: number,
}

class GameControl {

    constructor(bgioProps:BgioProps, localProps: GameControlProps) {
        this._bgioProps = bgioProps;
        this._localProps = localProps;
    }

    private _bgioProps:BgioProps;
    private _localProps: GameControlProps;

    // Public access to on-board or off-board pieces is though functions that
    // take account of flipping.
    private get _offBoardPieces() { return this._gameDefinition.offBoardPieces; }

    private get _gameDefinition () {  return this._localProps.gameDefinition; }

    private get _gameState() { return this._bgioProps.G; }

    private get _bgioMoves() { return this._bgioProps.moves as any as ClientMoves; }

    private get _historyManager() {
        return this._localProps.historyManager;
    }

    private _setGameState(state: GenericGameState) {
        this._bgioMoves.setGameState(state);
    }

    private _(state: GenericGameState) {
        this._bgioMoves.setGameState(state);
    }

    get name() { return this._gameDefinition.name;}

    get boardStyle() { return this._gameDefinition.boardStyle; }

    
    private _recordGameStateInHistory(state: GenericGameState) {
        this._historyManager.setState(state);
    }
    private _restoreHistoryState() {
        const state = this._historyManager.state;
        this._bgioMoves.setGameState(state);
    }

    get canUndo() : boolean {
        return this._historyManager.canUndo;
    }

    get canRedo() : boolean {
        return this._historyManager.canRedo;
    }

    undo() { 
        if(this._historyManager.undo()) {
            this._restoreHistoryState();
        }
     }
    redo() {
        if(this._historyManager.redo()) {
            this._restoreHistoryState();
        }
    }

    restart() {
        if(this._historyManager.restart()) {
            this._restoreHistoryState();
        }
    }

    get reverseBoardRows() { return this._localProps.reverseBoard[0]; }

    flipRowOrder() { this._localProps.reverseBoard[1](!this.reverseBoardRows); }

    get nRows() {
        return this._gameState.pieces? this._gameState.pieces[0].length : 0;
    }

    get nCols() {
        return this.nRows > 0 ? this._gameState.pieces[0].length : 0;
    }
    
    squareProperties(pos: PiecePosition): SquareProperties {

        const pieceName = () => {
            if (pos.row !== undefined) {
                return this._gameState.pieces[pos.row][pos.col];
            } else if (pos.top !== undefined) {
                return this._offBoardPieces.top[pos.top];
            } else {
                return this._offBoardPieces.bottom[pos.bottom];
            }
        }
        const selectedSquare = this._gameState.selectedSquare;
        const selected = Boolean(selectedSquare && samePiecePosition(pos, makePiecePosition(selectedSquare)));

        const legalMoveStatus = ()  => {

            const legalMoves = this._bgioProps.G.legalMoves;
            if(legalMoves && pos.row !== undefined && legalMoves[pos.row][pos.col]) {
                return LegalMoveStatus.Legal;
            }
    
            if( legalMoves && pos.row !== undefined && !legalMoves[pos.row][pos.col]) {
                return LegalMoveStatus.Illegal;
            }

            return LegalMoveStatus.Unknown;
        }

        const background = () => {
            if (pos.row === undefined) {
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
            changeable: pos.row !== undefined,

            gameStatus: {
                selected: selected,
                legalMoveStatus: legalMoveStatus(),
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

    private _makeMoveControl() {
        let newGameState = JSON.parse(JSON.stringify(this._bgioProps.G));
        return new MoveControl(this._offBoardPieces, newGameState, this.activePlayer);
    }
    
    private _applyMoveResult(moveResult: MoveResult, newGameState: GenericGameState) {
        if (!moveResult.noop) {
            this._setGameState(newGameState);
        }

        if (moveResult.endOfTurn) {
            this.endTurn();
        } if (moveResult.winner != null) {
            this.endGame(moveResult.winner);
        }

        if (moveResult.historyMarker) {
            this._recordGameStateInHistory(newGameState);
        }
    }

    squareClicked(pos: PiecePosition) {
        let moveControl = this._makeMoveControl();
        const moveResult = this._gameDefinition.onClick(pos, moveControl);
        this._applyMoveResult(moveResult, moveControl.state);
    }

    dragAllowed(pos: PiecePosition)  {
        const onDrag = this._gameDefinition.onDrag;
        return Boolean(onDrag && onDrag.startAllowed(pos));
    }

    onDragEnd(from: PiecePosition, to: PiecePosition | null) {
        const onDrag = this._gameDefinition.onDrag;
        if(!onDrag) {
            throw new Error("Unsupported drag");
        }

        let moveControl = this._makeMoveControl();
        const moveResult = onDrag.end(from, to, moveControl);
        this._applyMoveResult(moveResult, moveControl.state);
    }

    endTurn() {
        const endTurn = this._bgioProps.events.endTurn;
        if (endTurn) {
            endTurn();
        } else {
            throw new Error("endTurn is not defined");
        }
    }

    endGame(winner: number) {
        const endGame = this._bgioProps.events.endGame;
        if (endGame) {
            endGame({winner: winner});
        } else {
            throw new Error("endGame is not defined");
        }
    }

    get renderPiece() { return this._gameDefinition.renderPiece; }


    get activePlayer() { return this._bgioProps.ctx.playOrderPos;}
    
    get gameover() : undefined | {winner: number} {
        const gameover = this._bgioProps.ctx.gameover;
        if (gameover && typeof gameover.winner !== "number") {
            throw new Error("unexpect gameover status");
        }

        return gameover;
    }

    get players() : Players {
        let caller;
        if(!this._bgioProps.playerID) {
            //     throw new Error("PlayerID is null");
            caller = -1;
        } else {
            caller = parseInt(this._bgioProps.playerID);
        }

        const players = this._bgioProps.ctx.playOrder.map(name => {
            const playerNumber = Number(name);
            return `Player ${playerNumber + 1}`
        });

        

        return {
            playerNames: players,
            caller: caller,
        } 
    }

    get moveDescription () {return this._gameDefinition.moveDescription(this._gameState);}
}

export { GameControl as default, useGameControlProps, LegalMoveStatus  };
export type { SquareProperties, SquareBackground}
