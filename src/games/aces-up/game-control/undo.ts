import { PlayerID } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { copyJSON } from "../../../utils/copy-json";
import { ServerData, UndoItem } from "./server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";

export function makeUndoItem(G: ServerData, playerID: PlayerID) : UndoItem {
    return {
        sharedPiles: copyJSON(G.sharedPiles),
        playerID,
        playerData: copyJSON(G.playerData[playerID]),
        moveToSharedPile: G.moveToSharedPile,
    };
}

export function undo(
    { G } : MoveArg0<ServerData>, 
    _arg: void,
) : void {
    const undoItem = G.undoItems.pop();
    sAssert(undoItem, "No undo data available");

    G.sharedPiles = undoItem.sharedPiles;
    G.playerData[undoItem.playerID] = undoItem.playerData;
    
    // We don't want the move required message after an undo
    G.moveToSharedPile = 
        undoItem.moveToSharedPile === "required" ? "pending" : "done";
}