import { sAssert } from "../../../../utils/assert.js";
import { MoveArg0 } from "../../../move-fn.js";
import { ServerData } from "../server-data.js";

// Filter out unknown elements for the 'raw' heights array.
function filteredColumnHeights(G: ServerData, playerID: string) {
    return G.columnHeights[playerID].filter(Boolean);
}

export function doEndTurn(
    { G, events }: MoveArg0<ServerData>,
) : void {
    events.endTurn();
    G.rollCount.thisTurn = 0;

    // Check that all the various measures of column height are equal. 
    // (It's up to the calling code to ensure this.)
    for (const playerID in G.columnHeights) {
        const heights = filteredColumnHeights(G, playerID);
        
        for (const colHeight of heights) {
            sAssert(colHeight.thisTurn === colHeight.thisScoringChoice &&
                colHeight.thisTurn === colHeight.owned,
                "Column heights are not consistent at end of turn."
            );
        }
    }
}

export function clearUnownedScores(G: ServerData) : void {
    for (const playerID in G.columnHeights) {
        const heights = filteredColumnHeights(G, playerID);
        
        for (const colHeight of heights) {
            colHeight.thisScoringChoice = colHeight.thisTurn = colHeight.owned;
        }
    }
}

export function clearScoringChoice(G: ServerData) : void {
    for (const playerID in G.columnHeights) {
        const heights = filteredColumnHeights(G, playerID);
        
        for (const colHeight of heights) {
            colHeight.thisScoringChoice = colHeight.thisTurn;
        }
    }
}

export function commitScoringChoice(G: ServerData) : void {
    for (const playerID in G.columnHeights) {
        const heights = filteredColumnHeights(G, playerID);
        
        for (const colHeight of heights) {
            colHeight.thisTurn = colHeight.thisScoringChoice;
        }
    }
}

export function commitScoreThisTurn(G: ServerData) : void {
    for (const playerID in G.columnHeights) {
        const heights = filteredColumnHeights(G, playerID);
        
        for (const colHeight of heights) {
            colHeight.owned = colHeight.thisTurn;
        }
    }
}