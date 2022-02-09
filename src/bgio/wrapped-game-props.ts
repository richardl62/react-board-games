// NOTE/KLUDGE:  The matchData type supplied by boardgames.io seems not have
// isConnected as an optional member. The code below is my way of add it.

import { sAssert } from "../utils/assert";
import { BoardProps } from "./board-props";
import {  makePlayerData, PlayerDataDictionary } from "./player-data";

/**
 * Bgio type definition of 'moves'.
 *
 * Intended from limited use in, for example, quick prototypes.
 */

export type DefaultMovesType = BoardProps["moves"]; 

/**
 * Game properties.  (A wrapper for BGIO BoardProps.)
 */
export interface WrappedGameProps<G = unknown, Moves=unknown> 
    extends Omit<BoardProps<G>, "moves"> {
    
    moves: Moves;

    playerData: PlayerDataDictionary;
    allJoined: boolean;
    allConnected: boolean;

    playOrder: string[];
    playerID: string;

    currentPlayer: string;

    isMyTurn: boolean;

    name: (pid: string) => string;

}

export function makeWrappedGameProps<G>(bgioProps: BoardProps<G>): WrappedGameProps<G> {
 
    const playerData = makePlayerData(bgioProps);

    let allJoined = true;
    let allConnected = true;
    for (const playerID in playerData) {
        const pd = playerData[playerID];
        if (pd.status !== "connected") {
            allConnected = false;
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
        allConnected: allConnected,
        playOrder: bgioProps.ctx.playOrder,
        playerID: bgioProps.playerID,
        currentPlayer: bgioProps.ctx.currentPlayer,
        isMyTurn: bgioProps.playerID === bgioProps.ctx.currentPlayer,
        name: (pid: string) => {
            const pd = playerData[pid];
            if(!pd) {
                console.error("Invalid player id:", pid);
                return "<unknown>";
            }
            return playerData[pid].name;
        }
    };

    return obj;
}
