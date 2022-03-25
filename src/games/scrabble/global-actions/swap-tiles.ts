import { Ctx } from "boardgame.io";
import { GlobalGameState } from ".";
import { shuffle } from "../../../utils/shuffle";
import { Letter } from "../config";

export interface SwapTilesParam {
    /**
     * The rack before the swap.  This should be the same set of tiles
     * as  G.state.playerData[ctx.currentPlayer].rack, but could be in a different
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
    { rack: inputRack, toSwap }: SwapTilesParam
) : void {

    const newBag = [... G.state.bag];
    const newRack: Letter[] = [...inputRack];

    let nSwapped = 0;    
    for (let ri = 0; ri < newRack.length; ++ri) {
        if (toSwap[ri]) {
            newBag.push(newRack[ri]);
            newRack[ri] = newBag.shift()!;
            ++nSwapped;
        }
    }
    shuffle(newBag);

    G.state.playerData[ctx.currentPlayer].rack = newRack;
    G.state.bag = newBag;
    
    G.state.moveHistory.push({tilesSwapped: {
        pid: ctx.currentPlayer,
        nSwapped: nSwapped,
    }});
}