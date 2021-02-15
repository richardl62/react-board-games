import { useState } from 'react';

import { 
    PiecePosition, samePiecePosition, makePiecePosition, PieceName 
    } from '../piece-position';
import  { GameDefinition, MoveControl } from '../game-definition';

import * as Bgio from '../../bgio-tools';


const topLeftBlack = false; // KLUDGE

function useGameControlProps(gameDefinition: GameDefinition) {

    return {
        gameDefinition: gameDefinition,
        reverseBoard: useState(false),
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

    constructor(bgioProps: Bgio.BoardProps, localProps: GameControlProps) {
        this._bgioProps = bgioProps;
        this._localProps = localProps;
    }

    private _bgioProps: Bgio.BoardProps;
    private _localProps: GameControlProps;

    // Public access to on-board or off-board pieces is though functions that
    // take account of flipping.
    private get _offBoardPieces() { return this._gameDefinition.offBoardPieces; }

    private get _gameDefinition () {  return this._localProps.gameDefinition; }

    private get _G() { return this._bgioProps.G; }

    private get _bgioMoves() {
        return this._bgioProps.moves as any as Bgio.ClientMoves;
    }

    get boardStyle() { return this._gameDefinition.boardStyle; }

    undo() { this._bgioProps.undo(); }
    redo() { this._bgioProps.redo(); }
    restart() {
        this._bgioMoves.setGameState(this._gameDefinition.intialState);
    }

    get reverseBoardRows() { return this._localProps.reverseBoard[0]; }

    flipRowOrder() { this._localProps.reverseBoard[1](!this.reverseBoardRows); }

    get nRows() {
        return this._G.pieces.length;
    }

    get nCols() {
        return this._G.pieces[0].length;
    }
    squareProperties(pos: PiecePosition): SquareProperties {

        const pieceName = () => {
            if (pos.row !== undefined) {
                return this._G.pieces[pos.row][pos.col];
            } else if (pos.top !== undefined) {
                return this._offBoardPieces.top[pos.top];
            } else {
                return this._offBoardPieces.bottom[pos.bottom];
            }
        }
        const selectedSquare = this._G.selectedSquare;
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

    squareClicked(pos: PiecePosition) {
        let newGameState = JSON.parse(JSON.stringify(this._bgioProps.G));

        let moveControl = new MoveControl(newGameState, this.activePlayer);
        const moveResult = this._gameDefinition.onClick(pos, moveControl);

        if (!moveResult.noop) {
            this._bgioMoves.setGameState(newGameState);
        }

        if (moveResult.endOfTurn) {
            this.endTurn();
        } if (moveResult.winner != null) {
            this.endGame(moveResult.winner);
        }
    }

    onDragEnd(from: PiecePosition, to: PiecePosition | null) {
        console.log("drag from", from, "to", to && to);
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
        if(!this._bgioProps.playerID) {
            throw new Error("PlayerID is null");
        }

        const players = this._bgioProps.ctx.playOrder.map(name => {
            const playerNumber = Number(name);
            return `Player ${playerNumber + 1}`
        });

        const caller = parseInt(this._bgioProps.playerID);

        return {
            playerNames: players,
            caller: caller,
        } 
    }

    get moveDescription () {return this._gameDefinition.moveDescription(this._G);}
}

export { GameControl as default, useGameControlProps, LegalMoveStatus  };
export type { SquareProperties, SquareBackground}
