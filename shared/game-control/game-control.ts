import { RequiredServerData } from "./required-server-data.js";
import { RandomAPI } from "../utils/random-api.js";
import { MoveFn } from "./move-fn.js";
import { Ctx } from "./ctx.js";

export const AllActive = { allActive: true } as const;

export interface SetupArg0 {
    ctx: Ctx;
    random: RandomAPI;
}

// GameControl is used by the server and the app (c.f. AppGame which is used
// just by the app).
export interface GameControl {
    // Space-free name used to identify the game (c.f. displayName in AppGame).
    name: string

    minPlayers: number,
    maxPlayers: number,

    // KLUDGE?: The setup function is expected to return a type derived from
    // RequiredState. Specifying the return type as RequiredStates enforces this.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setup: (arg0: SetupArg0, setupData: any) => RequiredServerData;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    moves: { [moveName: string]: MoveFn<any> };

    // By default only the current player can make a move. But if turnControl
    // is set to AllActive, then any player make a move. (A correctly implemented
    // game should prevent illegal moves, so the check controlled here is really 
    // just to catch mistakes.)
    turnOrder?: typeof AllActive;
}