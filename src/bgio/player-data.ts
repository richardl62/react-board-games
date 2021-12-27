import { sAssert } from "../shared/assert";
import { BoardProps as BgioBoardProps, MatchDataElem } from "./board-props";
import { defaultPlayerName } from "./lobby-tools";

export const nonJoinedPlayerName = "<available>";

export interface PlayerData {
  name: string;
  status: "connected" | "not joined" | "notConnected";
}

export type PlayerDataDictionary = {[arg: string] : PlayerData};

function makePlayerDataElem(matchData: MatchDataElem[], playerID: string, numPlayers: number,
    offline: boolean): PlayerData {
    const playerIndex = parseInt(playerID);
    sAssert(!isNaN(playerIndex) && playerIndex >= 0 && playerIndex < numPlayers,
        `Unexpected player ID: "${playerID}"`
    );

    const md = matchData.find(md => md.id === playerIndex);
    sAssert(md, `Cannot find player data for ID ${playerID}`);
  
    if (!md.name) {
        return {
            name: offline ? defaultPlayerName(playerID) : nonJoinedPlayerName,
            status: "not joined",
        };
    }

    return {
        name: md.name,
        status: md.isConnected ? "connected" : "notConnected"
    };

}

function isOffline(props: BgioBoardProps) : boolean {
    const offline1 = !props.credentials;
    const offline2 = props.matchID === "default";
    if(offline1 !== offline2) {
        console.warn("Problem checkinf if match is offline");
    }
    return offline1 && offline2;
}

export function makePlayerData(props: BgioBoardProps): PlayerDataDictionary {
    const matchData = props.matchData;
    if(!matchData) {
        console.warn("Bgio match data is null");
        return {};
    }
    

    const playerData: PlayerDataDictionary = {};
    for (const id in props.ctx.playOrder) {
        playerData[id] = makePlayerDataElem(matchData, id, props.ctx.numPlayers,
            isOffline(props)
        );
    }

    return playerData;
}

