import { Ctx } from "boardgame.io";
import { wrappedMoveFunction } from "../../../app-game-support/wrapped-move-function";
import { sAssert } from "../../../utils/assert";
import { ServerData } from "./server-data";

type PlayerReadyArg = void;
function playerReady(G: ServerData, ctx: Ctx) {
    sAssert(ctx.playerID);
    G.playerData[ctx.playerID].ready = true;
}

export const bgioMoves = {
    playerReady: wrappedMoveFunction(playerReady),
};

export interface ClientMoves {
    playerReady: (arg: PlayerReadyArg) => void;
}
