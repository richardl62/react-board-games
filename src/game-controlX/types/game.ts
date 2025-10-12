import { Ctx } from "./ctx";
import { RandomAPI } from "./random-api";
import { MoveFn } from "./move-fn";

export const ActivePlayers = {
    ALL: "all",
};

export interface SetupArg0 {
    ctx: Ctx;
    random: RandomAPI;
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
        arg0: SetupArg0, 
        setupData?: SetupData
    ) => G;
    
    validateSetupData?: (setupData: SetupData | undefined, numPlayers: number) => string | undefined;
    
    moves?: {[moveName: string]: MoveFn<G>};

    turn?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        activePlayers?: any;
    },
}

export type { Game };

