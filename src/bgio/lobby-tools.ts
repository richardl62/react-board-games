import { LobbyClient } from "boardgame.io/client";
import { lobbyServer } from "../app/url-params";
import { AppGame, MatchID, Player } from "../shared/types";
import { unnamedPlayer } from "./player-data";

export function makeLobbyClient() : LobbyClient {
    return new LobbyClient({ server: lobbyServer() });
}

export async function createMatch(game: AppGame, numPlayers: number): Promise<MatchID> {
    const p = makeLobbyClient().createMatch(game.name, { numPlayers: numPlayers });
    const m = await p;
    return { mid: m.matchID };
}

export async function joinMatch(game: AppGame, matchID: MatchID, name: string | null = null): Promise<Player> {
    const match = await makeLobbyClient().getMatch(game.name, matchID.mid);

    const players = match.players;
    let index = 0;
    while (players[index].name) {
        ++index;
        if (index === players.length) {
            throw new Error("Match full - cannot join");
        }
    }

    const playerID = players[index].id.toString();

    const joinMatchResult = await makeLobbyClient().joinMatch(game.name, matchID.mid,
        { playerID: playerID, playerName: name || unnamedPlayer});

    return {
        id: playerID,
        credentials: joinMatchResult.playerCredentials,
    };
}
