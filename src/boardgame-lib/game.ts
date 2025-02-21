/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ctx } from "./ctx";
import { PlayerID } from "./playerid";
import { RandomAPI } from "./random";
import { EventsAPI } from "./events";

export const ActivePlayers = {
    ALL: "all",
};

type FnContext<G = any, PluginAPIs extends Record<string, unknown> = Record<string, unknown>> = PluginAPIs & {
    G: G;
    ctx: Ctx;
    random: RandomAPI;
    events: Required<EventsAPI>; // Use of Required<> is a kludge.
};

type MoveFn<G = any, PluginAPIs extends Record<string, unknown> = Record<string, unknown>> = 
    (
        context: FnContext<G, PluginAPIs> & {playerID: PlayerID;}, 
        ...args: any[]
    ) => void | G;

type Move<G = any, PluginAPIs extends Record<string, unknown> = Record<string, unknown>> = MoveFn<G, PluginAPIs>; 

interface MoveMap<G = any, PluginAPIs extends Record<string, unknown> = Record<string, unknown>> {
    [moveName: string]: Move<G, PluginAPIs>;
}

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
    
    moves?: MoveMap<G, PluginAPIs>;

    turn?: {
        activePlayers?: any;
    },
}

export type { Game };

export type MoveArg0<State> = Parameters<MoveFn<State>>[0];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SetupArg0 = any; //Parameters<Required<Game>["setup"]>[0];

