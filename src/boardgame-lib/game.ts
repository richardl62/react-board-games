/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ctx } from "./ctx";
import { PlayerID } from "./playerid";
import { RandomAPI } from "./random";
import { EventsAPI } from "./events";

export const ActivePlayers = {
    ALL: "all",
};

type FnContext<G = any> = {
    G: G;
    ctx: Ctx;
    random: RandomAPI;
    events: Required<EventsAPI>; // Use of Required<> is a kludge.
};

type MoveFn<G = any> = 
    (
        context: FnContext<G> & {playerID: PlayerID;}, 
        ...args: any[]
    ) => void | G;

type Move<G = any> = MoveFn<G>; 

interface MoveMap<G = any> {
    [moveName: string]: Move<G>;
}

interface Game<G = any, SetupData = any> {
    name?: string;
    minPlayers?: number;
    maxPlayers?: number;
    deltaState?: boolean;
    disableUndo?: boolean;
    seed?: string | number;
    setup?: (context: {
        ctx: Ctx;
    }, setupData?: SetupData) => G;
    
    validateSetupData?: (setupData: SetupData | undefined, numPlayers: number) => string | undefined;
    
    moves?: MoveMap<G>;

    turn?: {
        activePlayers?: any;
    },
}

export type { Game };

export type MoveArg0<State> = Parameters<MoveFn<State>>[0];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SetupArg0 = any; //Parameters<Required<Game>["setup"]>[0];

