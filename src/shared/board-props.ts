// NOTE/KLUDGE:  The matchData type supplied by boardgames.io seems not have
// isConnected as an optional member. The code below is my way of add it.

import { BoardProps as BgioBoardProps } from "./bgio-types";
import {  makePlayerData, PlayerDataDictionary } from "./player-data";


// 'G extends any = any' is copied from BoardProps. I don't see why it is better than 'any'.
/**
 * This BoardProps is an extention of BgioBoardProps Bgio BoardProps.
 */
export interface BoardProps<G=unknown> extends BgioBoardProps<G> {
  playerData: PlayerDataDictionary;
  allJoined: boolean;
  allReady: boolean;
}

export function makeBoardProps<G>(bgioProps: BgioBoardProps<G>): BoardProps<G> {

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
