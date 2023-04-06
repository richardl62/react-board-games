import { GameStage, ServerData, startingServerData } from "./server-data";
import { startRound } from "./start-round";
import { MoveArg0 } from "../../../app-game-support/bgio-types";

export function readyForNewGame(
    { G, ctx, playerID } : MoveArg0<ServerData>,
    _option: void): void {
    
    G.playerData[playerID].readyForNewGame = true;

    let allReady = true;
    for (const pid in G.playerData) {
        allReady = allReady && G.playerData[pid].readyForNewGame;
    }

    if (allReady) {
        const newG = startingServerData({ctx}, G.options);
        Object.assign(G, newG);

        G.stage = GameStage.makingGrids;
        startRound(G, ctx);
    }
}
