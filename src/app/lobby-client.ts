import React, { useContext } from 'react';
import { Servers } from './types';
import { LobbyClient as BgioLobbyClient} from 'boardgame.io/client';
import { Game } from './types';
import { LobbyAPI } from 'boardgame.io';

export type Match = LobbyAPI.Match;
export type CreatedMatch = LobbyAPI.CreatedMatch;
export type MatchList = LobbyAPI.MatchList;
class LobbyClient {
  constructor(servers: Servers, activeMatch: string | null) {
    this.servers = servers;
    this.activeMatch = activeMatch;
    this._lobbyClient = new BgioLobbyClient({ server: servers.lobby});
  }
  readonly servers: Servers;
  readonly activeMatch: string | null;
  readonly _lobbyClient: BgioLobbyClient;

  createMatch(game: Game, numPlayers: number): Promise<CreatedMatch> {
    return this._lobbyClient.createMatch(game.name, {
      numPlayers: 2
    });
  }

  getMatch(game: Game, matchID: string) {
    return this._lobbyClient.getMatch(game.name, matchID);
  }

  listMatches(game: Game) : Promise<MatchList> {
    return this._lobbyClient.listMatches(game.name);
  }

  joinActiveMatch(game: Game, playerID: string) {
    if(!this.activeMatch) {
      throw new Error("Active match not specificied");
    }
    return this._lobbyClient.joinMatch(game.name, this.activeMatch, {
      playerID: playerID,
      playerName: 'Player ' + playerID,
    })
  }
}

const LobbyClientContext = React.createContext<LobbyClient | null>(null);

function useLobbyClient() : LobbyClient {
  const context = useContext(LobbyClientContext);
  if(!context) {
    throw new Error("Lobby Context is not set");
  }
  return context;
}
// Type exports are done inline
export { LobbyClient, LobbyClientContext, useLobbyClient };
