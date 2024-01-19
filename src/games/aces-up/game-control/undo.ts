import { PlayerID } from "../../../boardgame-lib/bgio";
import { sAssert } from "../../../utils/assert";
import { copyJSON } from "../../../utils/copy-json";
import { ServerData, UndoItem } from "./server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";

export function makeUndoItem(G: ServerData, playerID: PlayerID) : UndoItem {
    return {
        sharedPileData: copyJSON(G.sharedPileData),
        playerID,
        playerData: copyJSON(G.playerData),
        moveToSharedPile: G.moveToSharedPile,
    };
}

export function undo(
    { G } : MoveArg0<ServerData>, 
    _arg: void,
) : void {
    const undoItem = G.undoItems.pop();
    sAssert(undoItem, "No undo data available");

    G.sharedPileData = undoItem.sharedPileData;
    G.playerData = undoItem.playerData;
    
    // We don't want the move required message after an undo
    G.moveToSharedPile = 
        undoItem.moveToSharedPile === "done" ? "done" : "not done";
}