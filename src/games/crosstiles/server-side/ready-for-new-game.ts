import { GameStage, ServerData, startingServerData } from "./server-data";
import { startRound } from "./start-round";
import { MoveArg0 } from "../../../boardgame-lib/game";

export function readyForNewGame(
    arg0 : MoveArg0<ServerData>,
    _option: void
): void {
    const { G, playerID, random } = arg0;

    G.playerData[playerID].readyForNewGame = true;

    let allReady = true;
    for (const pid in G.playerData) {
        allReady = allReady && G.playerData[pid].readyForNewGame;
    }

    if (allReady) {
        const newG = startingServerData(arg0, G.options);
        Object.assign(G, newG);

        G.stage = GameStage.makingGrids;
        startRound(G, random);
    }
}
