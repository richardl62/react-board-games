import { LobbyClient } from 'boardgame.io/client';
import { AppGame, MatchID, Player } from './types';
import { LobbyAPI } from 'boardgame.io';
import { lobbyServer } from './url-params';

export type MatchInfo = LobbyAPI.Match;
export type PublicPlayerInfo = MatchInfo['players'][0];
export type CreatedMatch = LobbyAPI.CreatedMatch;
export type MatchList = LobbyAPI.MatchList;

export const unnamedPlayer = '_Unnamed Player_';

function lobbyClient() {
  return new LobbyClient({ server: lobbyServer() });
}

export async function createMatch(game: AppGame, numPlayers: number): Promise<MatchID> {
  const p = lobbyClient().createMatch(game.name, { numPlayers: numPlayers })
  const m = await p;
  return { mid: m.matchID };
}

export function getActiveMatch(game: AppGame, matchID: MatchID): Promise<MatchInfo> {
  return lobbyClient().getMatch(game.name, matchID.mid);
}

export async function joinMatch(game: AppGame, matchID: MatchID, name: string | null = null): Promise<Player> {
  const match = await lobbyClient().getMatch(game.name, matchID.mid);

  const players = match.players;
  let index = 0;
  while (players[index].name) {
    ++index;
    if (index === players.length) {
      throw new Error("Match full - cannot join");
    }
  }

  const playerID = players[index].id.toString();

  const joinMatchResult = await lobbyClient().joinMatch(game.name, matchID.mid,
    { playerID: playerID, playerName: name || unnamedPlayer});

  return {
    id: playerID,
    credentials: joinMatchResult.playerCredentials,
  }
}

export function numPlayers(game: AppGame, matchID: MatchID): Promise<number> {
  return lobbyClient().getMatch(game.name, matchID.mid).then(mi => mi.players.length);
}
