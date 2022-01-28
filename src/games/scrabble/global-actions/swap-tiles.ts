import { Ctx } from "boardgame.io";
import { GlobalGameState } from ".";
import { shuffle } from "../../../shared/tools";
import { Letter } from "../config";

export interface SwapTilesParam {
    /**
     * The rack before the swap.  This should be the same set of tiles
     * as  G.playerData[ctx.currentPlayer].rack, but could be in a different
     * order.
     */
    rack: Letter[];

    /**
     * Array of the same size as rack. Indicated which of the tiles should be
     * swapped.
     */
    toSwap: boolean[];
} 

export function swapTiles(G: GlobalGameState, ctx: Ctx, 
    { rack: oldRack, toSwap }: SwapTilesParam
) : void {

    const bag = G.bag;
    G.bag = bag;

    const newRack: Letter[] = [];

    let nSwapped = 0;    
    for (let ri = 0; ri < oldRack.length; ++ri) {
        if (toSwap[ri]) {
            const old = oldRack[ri];
            bag.push(old);
            newRack[ri] = bag.shift()!;
            ++nSwapped;
        } else {
            newRack[ri] = oldRack[ri];
        }
    }
    shuffle(bag);

    G.playerData[ctx.currentPlayer].rack = newRack;

    G.moveHistory.push({tilesSwapped: {
        pid: ctx.currentPlayer,
        nSwapped: nSwapped,
    }});
}