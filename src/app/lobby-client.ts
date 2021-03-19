import React, { useContext } from 'react';
import { Servers } from './types';
import { LobbyClient as BgioLobbyClient} from 'boardgame.io/client';
import { Game } from './types';
import { LobbyAPI } from 'boardgame.io';

export type Match = LobbyAPI.Match;
export type CreatedMatch = LobbyAPI.CreatedMatch;
export type MatchList = LobbyAPI.MatchList;
class LobbyClient {
  constructor(game: Game, servers: Servers, activeMatch: string | null) {
    this.game = game;
    this.servers = servers;
    this.activeMatch = activeMatch;
    this._lobbyClient = new BgioLobbyClient({ server: servers.lobby});
  }
  readonly game: Game;
  readonly servers: Servers;
  readonly activeMatch: string | null;
  readonly _lobbyClient: BgioLobbyClient;

  createMatch(numPlayers: number): Promise<CreatedMatch> {
    return this._lobbyClient.createMatch(this.game.name, {
      numPlayers: 2
    });
  }

  getActiveMatch() : Promise<Match> {
    if(!this.activeMatch) {
      // Throw rather than failed promise as this is a usage error
      // rather than a network/server issue.
      throw new Error("active match not set");
    }
    return this._lobbyClient.getMatch(this.game.name, this.activeMatch);
  }

  getMatch(matchID: string) : Promise<Match> {
    return this._lobbyClient.getMatch(this.game.name, matchID);
  }

  listMatches() : Promise<MatchList> {
    return this._lobbyClient.listMatches(this.game.name);
  }

  joinActiveMatch(playerID: string) {
    if(!this.activeMatch) {
      throw new Error("Active match not specificied");
    }
    return this._lobbyClient.joinMatch(this.game.name, this.activeMatch, {
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
