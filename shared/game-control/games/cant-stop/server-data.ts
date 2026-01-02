import { SetupArg0 } from "../../game-control.js";
import { columnValues, nDice } from "./config.js";

export interface ColumnHeight {
    // The highest square which the player 'owns', i.e. which the player has stopped on in a previous turn.
    heightOwned: number | "full";
    
    // The highest point reached this turn. Will equal heightOwned if it is not this player's turn.
    heightThisTurn: number | "full" ;
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
            heightOwned: 0,
            heightThisTurn: 0,
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
