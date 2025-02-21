/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Ctx {
    numPlayers: number;
    playOrder: string[];
    currentPlayer: string;
    playOrderPos: number;
    gameover?: boolean;

    // KLUDGE: This is a hack to help with defining game moves.
    activePlayers: any;
    turn: any;
    phase: any;
}
