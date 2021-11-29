// NOTE/KLUDGE:  The matchData type supplied by boardgames.io seems not have
// isConnected as an optional member. The code below is my way of add it.

import { sAssert } from "../shared/assert";
import { BoardProps } from "./board-props";
import {  makePlayerData, PlayerDataDictionary } from "./player-data";

/**
 * Game properties.  (A wrapper for BGIO BoardProps.)
 */
export interface WrappedGameProps<G = unknown> extends BoardProps<G> {
    playerData: PlayerDataDictionary;
    allJoined: boolean;
    allReady: boolean;

    playOrder: string[];
    playerID: string;

    currentPlayer: string;

    isMyTurn: boolean;

    name: (pid: string) => string;
}

export function makeWrappedGameProps<G>(bgioProps: BoardProps<G>): WrappedGameProps<G> {
 
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

    sAssert(bgioProps.playerID);
    
    const obj = {
        ...bgioProps,
        playerData: playerData,
        allJoined: allJoined,
        allReady: allReady,
        playOrder: bgioProps.ctx.playOrder,
        playerID: bgioProps.playerID,
        currentPlayer: bgioProps.ctx.currentPlayer,
        isMyTurn: bgioProps.playerID === bgioProps.ctx.currentPlayer,
        name: (pid: string) => {
            return playerData[pid].name;
        }
    };

    return obj;
}
