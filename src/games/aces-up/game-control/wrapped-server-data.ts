import { PlayerID } from "boardgame.io";
import { ServerData, PlayerData } from "./server-data";
import { sAssert } from "../../../utils/assert";
import { Rank } from "../../../utils/cards/types";

export interface WrappedServerData extends ServerData {
    getPlayerData: (owner: PlayerID) => PlayerData;

    /* The highest rank excluding special cards. When a shared
    pile reaches this rank it is full */
    topRank: Rank;
}

export function makeWrappedServerData(G: ServerData) : WrappedServerData {
    const getPlayerData = (owner: PlayerID) => {
        const playerData = G.playerData[owner];
        sAssert(playerData);
        return playerData;
    };
    
    return {
        ...G,
        getPlayerData,
        topRank: "Q",
    };
}