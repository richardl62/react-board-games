import { LobbyClient } from "boardgame.io/client";
import { lobbyServer } from "../app/url-params";
import { AppGame, MatchID, Player } from "../shared/types";

export function defaultPlayerName(playerID: string): string {
    const playerNumber = parseInt(playerID);
    if (isNaN(playerNumber)) {
        console.warn(`Player ID "${playerID}" is not a number`);
    }
    return `Player${playerNumber+1}`;
}

export function makeLobbyClient() : LobbyClient {
    return new LobbyClient({ server: lobbyServer() });
}

export async function createMatch(game: AppGame, numPlayers: number): Promise<MatchID> {
    const p = makeLobbyClient().createMatch(game.name, { numPlayers: numPlayers });
    const m = await p;
    return { mid: m.matchID };
}

export async function joinMatch(game: AppGame, matchID: MatchID, name: string | null = null): Promise<Player> {
    const lobbyClient = makeLobbyClient();
    const match = await lobbyClient.getMatch(game.name, matchID.mid);

    const players = match.players;
    let index = 0;
    while (players[index].name) {
        ++index;
        if (index === players.length) {
            throw new Error("Match full - cannot join");
        }
    }

    const joinMatchResult = await lobbyClient.joinMatch(game.name, matchID.mid,
        {playerName: name || "unnamed"} );

    const credentials = joinMatchResult.playerCredentials;
    const playerID = joinMatchResult.playerID;

    if(!name) {
        await lobbyClient.updatePlayer(game.name, matchID.mid, {
            playerID: playerID,
            credentials: credentials,
            newName: defaultPlayerName(playerID),
        });
    }

    return {
        id: playerID,
        credentials: credentials,
    };
}
