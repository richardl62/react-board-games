import { Letter } from "../config";
import { GameState } from "./game-state";
import { MoveArg0 } from "../../../app-game-support/bgio-types";

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

export function swapTiles(
    {G: state, ctx, random} : MoveArg0<GameState>, 
    { rack: inputRack, toSwap }: SwapTilesParam
) : void {
    const newBag = [... state.bag];
    const newRack: Letter[] = [...inputRack];

    let nSwapped = 0;    
    for (let ri = 0; ri < newRack.length; ++ri) {
        if (toSwap[ri]) {
            newBag.push(newRack[ri]);
            newRack[ri] = newBag.shift()!;
            ++nSwapped;
        }
    }

    random.Shuffle(newBag);

    state.playerData[ctx.currentPlayer].rack = newRack;
    state.bag = newBag;
    
    state.moveHistory.push({tilesSwapped: {
        pid: ctx.currentPlayer,
        nSwapped: nSwapped,
    }});
}