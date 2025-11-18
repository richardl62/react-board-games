import { RequiredServerData } from "./required-server-data.js";
import { RandomAPI } from "../utils/random-api.js";
import { MoveFn } from "./move-fn.js";
import { Ctx } from "./ctx.js";

export const ActivePlayers = {
    ALL: "all",
};

export interface SetupArg0 {
    ctx: Ctx;
    random: RandomAPI;
}

// GameControl is used by the server and the app (c.f. AppGame which is used
// just by the app).
export interface GameControl { 
  // Space-free name used to identify the game (c.f. displayName in AppGame).
  name: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moves: {[moveName: string]: MoveFn<any>};

  // KLUDGE?: The setup function is expected to return a type derived from
  // RequiredState. Specifying the return type as RequiredStates enforces this.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup: (arg0: SetupArg0, setupData: any) => RequiredServerData;

  minPlayers: number,
  maxPlayers: number,

  turn?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        activePlayers?: any;
  },
}