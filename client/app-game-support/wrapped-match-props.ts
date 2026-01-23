// NOTE/KLUDGE:  The matchData type supplied by boardgames.io seems not have
// isConnected as an optional member. The code below is my way of add it.

import { sAssert } from "@utils/assert";
import { BoardProps } from "@/app-game-support/board-props";
import {  makePlayerDataHACKED, PlayerDataDictionary } from "./player-data";
import { useEffect } from "react";
import { EventsAPI } from "@shared/game-control/events";


/**
 * Game properties.  (A wrapper for BGIO BoardProps.)
 */
export interface WrappedMatchProps<G=unknown, Moves=unknown> 
    extends Omit<BoardProps<G>, "moves" | "events"> {
    
    moves: Moves;
    events: EventsAPI;

    playerData: PlayerDataDictionary;

    allJoined: boolean;
    
    /** Part of BGIO props, but here we assert it is non-null */
    playerID: string; 
    getPlayerName: (pid: string) => string;
}

export function useWrappedMatchProps<G>(bgioProps: BoardProps<G>): WrappedMatchProps<G> {
    useEffect(() => {
        console.log("Using makePlayerDataHACKED - temporary hack");
    }, []);
    const playerData = makePlayerDataHACKED(bgioProps);


    const allJoined = Object.values(playerData).every(pd => pd.status !== "not joined");
    
    sAssert(bgioProps.playerID);
    
    return {
        ...bgioProps,
        playerData,
        allJoined,
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
}
