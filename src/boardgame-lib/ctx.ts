//export type { Ctx } from "boardgame.io";
export interface Ctx {
    numPlayers: number;
    playOrder: string[];
    currentPlayer: string;
    playOrderPos: number;
    gameover?: boolean;
}
