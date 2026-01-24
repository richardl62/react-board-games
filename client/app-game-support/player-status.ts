import { PublicPlayerMetadata } from "@shared/lobby/types";

export function defaultPlayerName(playerID: string): string {
    const playerNumber = parseInt(playerID);
    if (isNaN(playerNumber)) {
        console.warn(`Player ID "${playerID}" is not a number`);
    }
    return `Player${playerNumber+1}`;
}

export const nonJoinedPlayerName = "<available>";

export type PlayerConnectionStatus = "connected" | "not joined" | "not connected";

interface PlayerStatus {
  name: string;
  connectionStatus: PlayerConnectionStatus;
}

export function makePlayerStatus(matchData: PublicPlayerMetadata[], playerID: string): PlayerStatus {
    const md = matchData.find(md => md.id === playerID);

    if (!md) {
        // Should never happen.
        console.log(`No metadata found for player ID "${playerID}"`);
        return {
            name: "Unknown Player",
            connectionStatus: "not joined", 
        };
    }

    if (!md.name) {
        return {
            name: nonJoinedPlayerName,
            connectionStatus: "not joined",
        };
    }

    return {
        name: md.name,
        connectionStatus: md.isConnected ? "connected" : "not connected"
    };
}

