import { Ctx } from "./ctx";

import { Game as BgioGameXXX } from "boardgame.io";
export type { BgioGameXXX };

export const ActivePlayers = {
    ALL: "all",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Game<G = any, PluginAPIs extends Record<string, unknown> = Record<string, unknown>, SetupData = any> {
    name?: string;
    minPlayers?: number;
    maxPlayers?: number;
    deltaState?: boolean;
    disableUndo?: boolean;
    seed?: string | number;
    setup?: (context: PluginAPIs & /*DefaultPluginAPIs &*/ {
        ctx: Ctx;
    }, setupData?: SetupData) => G;
    
    validateSetupData?: (setupData: SetupData | undefined, numPlayers: number) => string | undefined;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    moves?: any; //MoveMap<G, PluginAPIs>;  TEMPORARY

    turn?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        activePlayers?: any;
    },
}

export type { Game };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SetupArg0 = any; //Parameters<Required<Game>["setup"]>[0];