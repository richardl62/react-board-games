import { Ctx } from "./ctx";
import { PlayerID } from "./playerid";
import { RandomAPI } from "./random";
import { EventsAPI } from "./events";

export const ActivePlayers = {
    ALL: "all",
};

type MoveFn<G> = 
    (
        context: {
            G: G;
            ctx: Ctx;
            playerID: PlayerID;
            random: RandomAPI;
            events: Required<EventsAPI>; // Use of Required<> is a kludge.
        }, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...args: any[]
    ) => void | G;


interface MoveMap<G > {
    [moveName: string]: MoveFn<G>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Game<G = any, SetupData = any> {
    name?: string;
    minPlayers?: number;
    maxPlayers?: number;
    deltaState?: boolean;
    disableUndo?: boolean;
    seed?: string | number;
    setup?: (
        context: {
            ctx: Ctx;
            random: RandomAPI;
        }, 
        setupData?: SetupData
    ) => G;
    
    validateSetupData?: (setupData: SetupData | undefined, numPlayers: number) => string | undefined;
    
    moves?: MoveMap<G>;

    turn?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        activePlayers?: any;
    },
}

export type { Game };

export type MoveArg0<State> = Parameters<MoveFn<State>>[0];

export type SetupArg0 = Parameters<Required<Game>["setup"]>[0];
