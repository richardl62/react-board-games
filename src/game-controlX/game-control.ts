import { RequiredServerData } from "./required-server-data";
import { RandomAPI } from "./random-api";
import { MoveFn } from "./move-fn";
import { Ctx } from "./ctx";

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
  setup: (arg0: SetupArg0, setupData?: unknown) => RequiredServerData;

  minPlayers: number,
  maxPlayers: number,

  turn?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        activePlayers?: any;
  },
}