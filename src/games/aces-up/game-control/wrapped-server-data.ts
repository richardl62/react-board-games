import { PlayerID } from "boardgame.io";
import { ServerData, PlayerData } from "./server-data";
import { sAssert } from "../../../utils/assert";

export interface WrappedServerData extends ServerData {
    getPlayerData: (owner: PlayerID) => PlayerData;
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
    };
}