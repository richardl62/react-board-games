import { nNonNull } from "../../../utils/n-non-null";
import { ReducerState } from "./local-game-state";

/** Return a short-ish string describing problems found or null if no problem was found.
 */
export function sanityCheck(state: ReducerState): string | null {
    // Sanity check
    const nTiles = countTiles(state);
    const nTilesExpected = state.config.makeFullBag().length; // inefficient
    if(nTiles !== nTilesExpected) {
        return `Sanity check failure: expected ${nTilesExpected} tiles but found ${nTiles}`;
    }

    return null;
}

function countTiles(state: ReducerState): number {
    let racks = nNonNull(state.rack);
    for (const playerID in state.playerData) {
        if (playerID !== state.scrabbleGameProps.playerID) {
            racks += nNonNull(state.playerData[playerID].rack);
        }
    }

    const board = nNonNull(state.board.flat()); // inefficient.
    const bag = state.nTilesInBag;
    return racks + board + bag;
}
