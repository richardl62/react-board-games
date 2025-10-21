import { GameStage, ServerData } from "../server-data.js";
import { startRound } from "./start-round.js";
import { MoveArg0 } from "../../../move-fn.js";

export function readyToStartGame(
    { G, playerID, random } : MoveArg0<ServerData>,
    _arg: void): void {
    if (G.stage !== GameStage.starting) {
        throw new Error("Unexpected call to readyToStartGame");
    }

    G.playerData[playerID].readyToStartGame = true;
    G.playerData[playerID].gridRackAndScore = null;

    let allReady = true;
    for (const pid in G.playerData) {
        allReady = allReady && G.playerData[pid].readyToStartGame;
    }

    if (allReady) {
        G.stage = GameStage.makingGrids;
        startRound(G, random);
    }
}
