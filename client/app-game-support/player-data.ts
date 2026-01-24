import { sAssert } from "@utils/assert";
import { PublicPlayerMetadata } from "@shared/lobby/types";
import { Ctx } from "@shared/game-control/ctx";

export function defaultPlayerName(playerID: string): string {
    const playerNumber = parseInt(playerID);
    if (isNaN(playerNumber)) {
        console.warn(`Player ID "${playerID}" is not a number`);
    }
    return `Player${playerNumber+1}`;
}

export const nonJoinedPlayerName = "<available>";

export interface PlayerData {
  name: string;
  status: "connected" | "not joined" | "notConnected";
}

export type PlayerDataDictionary = {[arg: string] : PlayerData};

function makePlayerDataElem(matchData: PublicPlayerMetadata[],  playerID: string, numPlayers: number): PlayerData {

    // For legacy reasons players IDs are strings which record numbers, with there numbers
    // being the players position.  Code should rely on this, but in case some does check 
    // the rule here.
    const playerIndex = parseInt(playerID);
    sAssert(!isNaN(playerIndex) && playerIndex >= 0 && playerIndex < numPlayers,
        `Unexpected player ID: "${playerID}"`
    );

    const md = matchData.find(md => md.id === playerID);
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

export function makePlayerData(
    ctx: Ctx,
    matchData: PublicPlayerMetadata[],
): PlayerDataDictionary {
    const playerData: PlayerDataDictionary = {};
    for (const id of ctx.playOrder) {
        playerData[id] = makePlayerDataElem(matchData, id, ctx.numPlayers);
    }

    return playerData;
}

