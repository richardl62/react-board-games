import { sAssert } from "@utils/assert";
import { PublicPlayerMetadata } from "@shared/lobby/types";

export function defaultPlayerName(playerID: string): string {
    const playerNumber = parseInt(playerID);
    if (isNaN(playerNumber)) {
        console.warn(`Player ID "${playerID}" is not a number`);
    }
    return `Player${playerNumber+1}`;
}

export const nonJoinedPlayerName = "<available>";

export type PlayerConnectionStatus = "connected" | "not joined" | "notConnected";

interface PlayerStatus {
  name: string;
  connectionStatus: PlayerConnectionStatus;
}

export function makePlayerStatus(matchData: PublicPlayerMetadata[],  playerID: string): PlayerStatus {

    const md = matchData.find(md => md.id === playerID);
    sAssert(md, `Cannot find player data for ID ${playerID}`);
  
    if (!md.name) {
        return {
            name: nonJoinedPlayerName,
            connectionStatus: "not joined",
        };
    }

    return {
        name: md.name,
        connectionStatus: md.isConnected ? "connected" : "notConnected"
    };
}

