import { useState } from 'react';

import { PiecePosition, PieceName } from '../../interfaces';
import { GameDefinition } from '../../game-definition';

import * as Bgio from '../../bgio';

// function rowAndCol(pos: { row: number, col: number }) {
//     return { r: pos.row, c: pos.col, }
// }

// function allFalse(arr: Array<Array<boolean>>) {
//     for(let i in arr) {
//         const inner = arr[i];
//         for (let j in inner) {
//             if(inner[j]) {
//                 return false;
//             }
//         }
//     }

//     return true;
// }

// function makePosition(pos: {
//     row?: number,
//     col?: number,
//     top?: number,
//     bottom?: number,
// }) {
//     return {
//         r: pos.row,
//         c: pos.col,
//         top: pos.top,
//         bottom: pos.bottom,
//     }
// }

// interface Position {
//     r?: number;
//     c?: number;
//     top?: number;
//     bottom?: number;
// }

// function unmakePosition(pos: Position) {
//     return {
//         row: pos.r,
//         col: pos.c,
//         top: pos.top,
//         bottom: pos.bottom,
//     }
// }

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

// function copyPieces(pieces: BoardPieces) {
//     return pieces.map(row => [...row]);
// }

class GameControl {

    constructor(bgioProps: Bgio.BoardProps, localProps: GameControlProps) {
        this._bgioProps = bgioProps;
        this._localProps = localProps;

        // this._clickManager = new ClickManager({
        //     getSelectedSquare: () => {
        //         const selected = bgioProps.G.selectedSquare;
        //         return selected && new PiecePosition(unmakePosition(selected));
        //     },
        //     setSelectedSquare: (p: PiecePosition | null) => this._setSelectedSquare(p),
        //     doMove: (p1: PiecePosition, p2: PiecePosition | null) =>
        //         this.movePieceRequest(p1, p2),
        // });
    }

    private _bgioProps: Bgio.BoardProps;
    private _localProps: GameControlProps;
    // private _clickManager: ClickManager;

    // Public access to on-board or off-board pieces is though functions that
    // take account of flipping.
    private get _boardPieces() { return this._bgioProps.G.pieces; }
    private get _offBoardPieces() { return this._gameDefinition.offBoardPieces; }

    private get _gameDefinition () {  return this._localProps.gameDefinition; }

    private get _gameState() { return this._bgioProps.G.gameState; }

    private get _bgioMoves() {
        return this._bgioProps.moves as any as Bgio.ClientMoves;
    }

    get gameType() { return this._gameDefinition.gameType; }
    get boardStyle() { return this._gameDefinition.boardStyle; }

    undo() { this._bgioProps.undo(); }
    redo() { this._bgioProps.redo(); }
    restart() {
        this._bgioMoves.setPieces(this._gameDefinition.pieces);
    }

    get reverseBoardRows() { return this._localProps.reverseBoard[0]; }

    flipRowOrder() { this._localProps.reverseBoard[1](!this.reverseBoardRows); }

    get nRows() {
        return this._boardPieces.length;
    }

    get nCols() {
        return this._boardPieces[0].length;
    }

    // makeMove(args: Parameters<GameDefinition["makeMove"]>[0]) {
    //     const result = this._gameDefinition.makeMove(args);
    //     if(!result.valid()) {
    //         throw new Error("Invalid result from game move");
    //     }

    //     return result;
    // }

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
        // const clickedPos = this._clickManager.selected;
        // const selected = Boolean(clickedPos && PiecePosition.same(pos, clickedPos));

        // const legalMoveStatus = ()  => {

        //     const legalMoves = this._bgioProps.G.legalMoves;
        //     if(clickedPos && legalMoves && pos.onBoard && legalMoves[pos.row][pos.col]) {
        //         return LegalMoveStatus.Legal;
        //     }
    
        //     if(clickedPos && legalMoves && pos.onBoard && !selected && !legalMoves[pos.row][pos.col]) {
        //         return LegalMoveStatus.Illegal;
        //     }

        //     return LegalMoveStatus.Unknown;
        // }

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
                selected: false, //selected,
                legalMoveStatus: LegalMoveStatus.Unknown, //legalMoveStatus(),
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
        this._gameDefinition.onClick(pos, this._gameState);   
    }

    // private _setSelectedSquare(p: PiecePosition | null) {

    //     if (p) {
    //         const legalMoves = this._gameDefinition.legalMoves({
    //             from: p,
    //             pieces: this._boardPieces,
    //             gameState: this._gameState,
    //             activePlayer: this.players.caller,
    //         });

    //         if (legalMoves && allFalse(legalMoves)) {
    //             // All moves are declated illegal.  Do nothing.
    //         } else {
    //             this._bgioMoves.setSelectedSquare({
    //                 selected: makePosition(p.data),
    //                 legalMoves: legalMoves,
    //             });
    //         }
    //     } else {
    //         this._bgioMoves.setSelectedSquare({
    //             selected: null,
    //             legalMoves: null,
    //         });
    //     }
    // }

    clearAll() {
        const emptyBoard = this._boardPieces.map(row => row.map(() => null));
        this._bgioMoves.setPieces(emptyBoard);
    };

    onDragEnd(from: PiecePosition, to: PiecePosition | null) {
        console.log("drag from", from.data, "to", to && to.data);
    }

    // // Process a user request - by drag or clicks - to move a piece.
    // movePieceRequest(from: PiecePosition, to: PiecePosition | null) {
    //     const toProps = to && this.squareProperties(to);
    //     const fromProps = this.squareProperties(from);

    //     if (to && toProps && toProps.gameStatus.legalMoveStatus !== LegalMoveStatus.Illegal) {
    //         let endTurn = true;
    //         let badMove = false;
    //         let winner = null;
    //         if (toProps && toProps.changeable) {
    //             if (fromProps.changeable) {
    //                 let pieces = copyPieces(this._boardPieces);
    //                 let gameState = { ...this._gameState };


    //                 const moveResult = this.makeMove({
    //                     from: from, to: to,
    //                     pieces: pieces, gameState: gameState,
    //                     activePlayer: this.activePlayer,
    //                 });

    //                 if (moveResult.illegal) {
    //                     badMove = true;
    //                     console.log("Bad move reported")
    //                 } else {
    //                     this._bgioMoves.setGameState(gameState);
    //                     this._bgioMoves.setPieces(pieces);
    //                 }
    //                 winner = moveResult.winner;
    //                 endTurn = moveResult.endOfTurn;
    //             } else {
    //                 this._bgioMoves.setPiece({
    //                     pos: rowAndCol(to),
    //                     pieceName: fromProps.pieceName
    //                 });
    //             }
    //         } else {
    //             // A piece has been dragged or click-moved somewhere it won't go,
    //             // i.e. off the board. Treat this as a request to clear the piece.
    //             if (fromProps.changeable) {
    //                 this._bgioMoves.setPiece({
    //                     pos: rowAndCol(from),
    //                     pieceName: null
    //                 });
    //             }
    //         }

    //         if(!badMove) {
    //             this._clickManager.clear();
    //         }
            
    //         if( winner != null ) {
    //             this.endGame(winner);
    //         }
    //         if (endTurn) {  
    //             this.endTurn();
    //         }
    //     }
    // }

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

    get moveDescription () {return this._gameDefinition.moveDescription(this._gameState);}
}

export { GameControl as default, useGameControlProps, LegalMoveStatus  };
export type { SquareProperties, SquareBackground}
