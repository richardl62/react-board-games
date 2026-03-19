import { SetupArg0 } from "../../game-control.js";
import { columnValues, maxColumnHeight, nDice } from "./config.js";

export interface SetupOptions {
    readonly minClearanceAbove: number;
    readonly minClearanceBelow: number;
    readonly partiallyFillAtStart: boolean;
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

    columnHeights: Record<string, ColumnHeight[]>;

    diceValues: number[];
    scoringOptions: number[][]; // Computed from diceValues and columnHeights.
    
    /** An index into 'scoringOptions' or a string. */
    scoringChoice: number | "rollRequired" | "choiceRequired" | "bust";

    /** Use to trigger animations. */
    rollCount: number;
}

// Starting heights for one player
function startingColumnsHeights(playerID: string, partiallyFillAtStart: boolean): ColumnHeight[] {
    const data: ColumnHeight[] = [];
    for (const col of columnValues) {
        let height : number | "full" = 0;
        if ( partiallyFillAtStart ) {
            if ( col == 5 ) {
                height = playerID === "1" ?  6: "full";
            }
            else if(col === 7) {
                height = 2;
            } else {
                const special = (col === 4 && playerID === "1") ||
                    (col === 8 && playerID === "0");
                height = maxColumnHeight(col) - (special ? 1 : 2);
            } 
        }


        data[col] = {
            owned: height,
            thisTurn: height,
            thisScoringChoice: height,
        };
    }

    return data;
}

export function startingServerData(arg0: SetupArg0, options: SetupOptions): ServerData {
    const {ctx} = arg0;

    const columnHeights :  Record<string, ColumnHeight[]> = {};
    for (const playerID of ctx.playOrder) {
        columnHeights[playerID] = startingColumnsHeights(playerID, options.partiallyFillAtStart);
    }

    return {
        options,

        columnHeights,
        
        diceValues: Array<number>(nDice).fill(1),
        scoringOptions: [],
        scoringChoice: "rollRequired",
    
        rollCount: 0,
    }
}
