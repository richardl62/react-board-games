import { SetupArg0 } from "../../game-control.js";
import { columnValues, nDice } from "./config.js";

export interface SetupOptions {
    readonly minClearanceAbove: number;
    readonly minClearanceBelow: number;
}

// Various measures of a player's progress.
// - These values will be equal when it not the player's turn.
// - During the players turn owned <= thisTurn <= thisScoringChoice 
//   with 'full' being considered bigger than normal numbers.
export interface ColumnHeight {
    /** The highest square which the player 'owns', i.e. which the player has stopped on
    in a previous turn. */
    owned: number | "full";
    
    /** The highest square the player has reached, taking into account previous rolls
    during this turn. */
    thisTurn: number | "full";

    /** The highest square the player has reached given the current scoring choice. 
    'Scoring choice' means the option the user picked from those available following a
    dice roll. */
    thisScoringChoice: number | "full";
};

export interface ServerData {
    options: SetupOptions;

    diceValues: number[];

    /** Use to trigger animations. */
    rollCount: {
        total: number;
        thisTurn: number;
    };

    columnHeights: Record<string, ColumnHeight[]>;
}

// Starting heights for one player
function startingColumnsHeights(): ColumnHeight[] {
    const data: ColumnHeight[] = [];
    for (const col of columnValues) {
        data[col] = {
            owned: 0,
            thisTurn: 0,
            thisScoringChoice: 0,
        };
    }

    return data;
}

export function startingServerData(arg0: SetupArg0, options: SetupOptions): ServerData {
    const {ctx} = arg0;

    const columnHeights :  Record<string, ColumnHeight[]> = {};
    for (const playerID of ctx.playOrder) {
        columnHeights[playerID] = startingColumnsHeights();
    }

    return {
        options,
        
        diceValues: Array<number>(nDice).fill(1),

        rollCount: {
            total: 0,
            thisTurn: 0,
        },

        columnHeights,
    }
}
