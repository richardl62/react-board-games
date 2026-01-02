import { SetupArg0 } from "../../game-control.js";
import { columnValues, nDice } from "./config.js";

export interface ColumnHeight {
    // The highest square which the player 'owns', i.e. which the player has stopped on in a previous turn.
    owned: number | "full";
    
    // The highest square a player will reach if they stop now without going bust.  
    thisTurn: number | "full";

    // The hieght square a player will reach given the current dice choice. Will equal thisTurn if no
    // has been made since the last roll. (To do: Consider automatically selected if there is only one choice.) 
    thisDiceChoice: number | "full";
};

export interface ServerData {
    diceValues: number[];
    rollCount: {
        total: number;
        thisTurn: number;
    };

    columnHeights: {[playerID: string]: ColumnHeight[]};
}

// Starting heights for one player
function startingColumnsHeights(): ColumnHeight[] {
    const data: ColumnHeight[] = [];
    for (const col of columnValues) {
        data[col] = {
            owned: 0,
            thisTurn: 0,
            thisDiceChoice: 0,
        };
    }

    return data;
}

export function startingServerData(arg0: SetupArg0): ServerData {
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
        diceValues,
        rollCount: {
            total: 0,
            thisTurn: 0,
        },
        columnHeights: columnsHeights
    }
}
