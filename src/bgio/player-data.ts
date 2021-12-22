import { sAssert } from "../shared/assert";
import { BoardProps as BgioBoardProps, MatchDataElem } from "./board-props";

export const nonJoinedPlayerName = "<available>";

export interface PlayerData {
  name: string;
  status: "connected" | "not joined" | "notConnected";
}

export type PlayerDataDictionary = {[arg: string] : PlayerData};

function makePlayerDataElem(matchData: MatchDataElem[], playerID: string, numPlayers: number): PlayerData {
    const playerIndex = parseInt(playerID);
    sAssert(!isNaN(playerIndex) && playerIndex >= 0 && playerIndex < numPlayers,
        `Unexpected player ID: "${playerID}"`
    );

    const md = matchData.find(md => md.id === playerIndex);
    sAssert(md, `Cannot find player data for ID ${playerID}`);
  
    if (!md.name) {
        return {
            name: nonJoinedPlayerName,
            status: "not joined",
        };
    }

    return {
        name: md.name,
        status: md.isConnected ? "connected" : "notConnected"
    };

}

export function makePlayerData(props: BgioBoardProps): PlayerDataDictionary {
    
    const matchData = props.matchData;
    if(!matchData) {
        console.warn("Bgio match data is null");
        return {};
    }
    
    const playerData : PlayerDataDictionary = {};
    for(const id in props.ctx.playOrder) {
        playerData[id] = makePlayerDataElem(matchData, id, props.ctx.numPlayers);
    }

    return playerData;
}

