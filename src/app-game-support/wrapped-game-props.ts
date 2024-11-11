// NOTE/KLUDGE:  The matchData type supplied by boardgames.io seems not have
// isConnected as an optional member. The code below is my way of add it.

import { sAssert } from "../utils/assert";
import { BoardProps } from "../bgio-workaround/board-props";
import {  makePlayerData, PlayerDataDictionary } from "./player-data";
import * as UrlParams from "../app/url-params";
import { RequiredServerData } from "./required-server-data";
/**
 * Bgio type definition of 'moves'.
 *
 * Intended from limited use in, for example, quick prototypes.
 */

export type DefaultMovesType = BoardProps["moves"]; 

type BgioEvents = BoardProps["events"];

interface Events extends Omit<BgioEvents, "endTurn"> {
    endTurn: Required<BgioEvents>["endTurn"];
}

/**
 * Game properties.  (A wrapper for BGIO BoardProps.)
 */
export interface WrappedGameProps<G extends RequiredServerData = RequiredServerData, Moves=unknown> 
    extends Omit<BoardProps<G>, "moves" | "events"> {
    
    moves: Moves;
    events: Events;

    playerData: PlayerDataDictionary;

    offline: boolean;
    allJoined: boolean;
    allConnected: boolean;
    
    /** Part of BGIO props, but here we assert it is non-null */
    playerID: string; 
    getPlayerName: (pid: string) => string;
}

export function makeWrappedGameProps<G extends RequiredServerData>(bgioProps: BoardProps<G>): WrappedGameProps<G> {
 
    const playerData = makePlayerData(bgioProps);
    const {isOffline} = UrlParams;

    let allJoined = true;
    let allConnected = true;

    // KLUDGE?: Assume all players in an offline game are connected
    if (!isOffline) {
        for (const playerID in playerData) {
            const pd = playerData[playerID];
            if (pd.status !== "connected") {
                allConnected = false;
            }
            if (pd.status === "not joined") {
                allJoined = false;
            }
        }
    }
    sAssert(bgioProps.playerID);
    
    const bigoEvents = bgioProps.events;
    const endTurn = bigoEvents.endTurn;
    sAssert(endTurn);

    const events : Events = {...bigoEvents, endTurn: endTurn}; 

    const obj = {
        ...bgioProps,
        events: events,
        playerData: playerData,
        offline: isOffline,
        allJoined: allJoined,
        allConnected: allConnected,
        playerID: bgioProps.playerID,
        getPlayerName: (pid: string) => {
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
