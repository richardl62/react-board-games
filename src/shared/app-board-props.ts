// NOTE/KLUDGE:  The matchData type supplied by boardgames.io seems not have
// isConnected as an optional member. The code below is my way of add it.

import { BoardProps } from "./bgio-types";
import {  makePlayerData, PlayerDataDictionary } from "./player-data";

export interface AppBoardProps<G=unknown> extends BoardProps<G> {
  playerData: PlayerDataDictionary;
  allJoined: boolean;
  allReady: boolean;
}

export function makeAppBoardProps<G>(bgioProps: BoardProps<G>): AppBoardProps<G> {

    const playerData = makePlayerData(bgioProps);

    let allJoined = true;
    let allReady = true;
    for (const playerID in playerData) {
        const pd = playerData[playerID];
        if (pd.status !== "ready") {
            allReady = false;
        }
        if (pd.status === "not joined") {
            allJoined = false;
        }
    }

    return {
        ...bgioProps,
        playerData: playerData,
        allJoined: allJoined,
        allReady: allReady,
    };
}
