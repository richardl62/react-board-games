import { SetupArg0 } from "../../game-control.js";
import { columnValues, nDice } from "./config.js";

export interface SetupOptions {
    readonly minClearanceAbove: number;
    readonly minClearanceBelow: number;
}

export interface ColumnHeight {
    // The highest square which the player 'owns', i.e. which the player has stopped on in a previous turn.
    owned: number | "full";
    
    // The highest square a player will reach if they stop now without going bust.  
    thisTurn: number | "full";

    // The hieght square a player will reach given the current scoring choice. ('Scoring choice' means the 
    // option the user picked from those available following a dice roll).
    // Will equal thisTurn if no scoring choice has been made since the last roll.
    thisScoringChoice: number | "full";
};

export interface ServerData {
    options: SetupOptions;

    diceValues: number[];
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
    
    const diceValues: number[] = [];
    for (let index = 0; index < nDice; index++) {
        diceValues[index] = 1;
    }

    const columnsHeights : ServerData["columnHeights"] = {};
    for (const playerID of ctx.playOrder) {
        columnsHeights[playerID] = startingColumnsHeights();
    }

    return {
        options,
        
        diceValues,
        rollCount: {
            total: 0,
            thisTurn: 0,
        },
        columnHeights: columnsHeights
    }
}
