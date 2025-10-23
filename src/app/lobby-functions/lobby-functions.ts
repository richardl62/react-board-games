import { lobbyClient } from "./lobby-client";
import { Match, MatchList } from "@lobby/types";
import { AppGame, defaultPlayerName, MatchID, Player } from "../../app-game-support";


export async function createMatch(
    game: AppGame,
    options: { numPlayers: number, setupData: unknown },
): Promise<MatchID> {
    const p = lobbyClient.createMatch({ 
        gameName: game.name, 
        numPlayers: options.numPlayers,
        setupData: options.setupData 
    });
    const m = await p;
    return { mid: m.matchID };
}

export async function getMatch(gameName: string, matchID: string): Promise<Match>
{
    return lobbyClient.getMatch({ gameName, matchID });
}

export async function listMatches(gameName: string): Promise<MatchList> {
    return lobbyClient.listMatches({ gameName });
}

export async function joinMatch(game: AppGame, matchID: MatchID, name: string | null = null): Promise<Player> {
    const match = await lobbyClient.getMatch({ 
        gameName: game.name, 
        matchID: matchID.mid
    });

    const players = match.players;
    let index = 0;
    while (players[index].name) {
        ++index;
        if (index === players.length) {
            throw new Error("Match full - cannot join");
        }
    }

    const joinMatchResult = await lobbyClient.joinMatch({
        gameName: game.name, matchID: matchID.mid,
        playerName: name || "unnamed"
    });

    const credentials = joinMatchResult.playerCredentials;
    const playerID = joinMatchResult.playerID;

    if(!name) {
        await lobbyClient.updatePlayer({
            gameName: game.name, 
            matchID: matchID.mid,
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
