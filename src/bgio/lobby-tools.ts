import { LobbyClient } from "boardgame.io/client";
import { lobbyServer } from "../app/url-params";
import { AppGame, MatchID, Player } from "../shared/types";

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

    const playerID = players[index].id.toString();

    const joinMatchResult = await lobbyClient.joinMatch(game.name, matchID.mid,
        { playerID: playerID, playerName: name || "unnamed"});

    const credentials = joinMatchResult.playerCredentials;

    if(!name) {
        const playerNumber = parseInt(playerID) + 1;
        if(isNaN(playerNumber)) {
            console.warn(`Player ID "${playerID}" is not a number`);
        }
        await lobbyClient.updatePlayer(game.name, matchID.mid, {
            playerID: playerID,
            credentials: credentials,
            newName: `Player ${playerNumber}`,
        });
    }

    return {
        id: playerID,
        credentials: credentials,
    };
}
