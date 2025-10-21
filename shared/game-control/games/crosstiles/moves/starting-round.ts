import { GameStage, ServerData } from "../server-data.js";
import { startRound } from "./start-round.js";
import { MoveArg0 } from "../../../move-fn.js";

export function readyForNextRound(
    { G, playerID, random }: MoveArg0<ServerData>,
    _arg: void
): void {
    if (G.stage !== GameStage.scoring) {
        throw new Error("Unexpected call to readyForNextRound");
    }

    G.playerData[playerID].readyForNextRound = true;

    let allReady = true;
    for (const pid in G.playerData) {
        allReady = allReady && G.playerData[pid].readyForNextRound;
    }

    if (allReady) {
        G.stage = GameStage.makingGrids;
        startRound(G, random);
    }
}
