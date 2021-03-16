import React, { useContext } from 'react';
import { Servers } from './types';
import { LobbyClient as BgioLobbyClient} from 'boardgame.io/client';
import { Game } from './types';
import { LobbyAPI } from 'boardgame.io';

export type Match = LobbyAPI.Match;
export type CreatedMatch = LobbyAPI.CreatedMatch;
export type MatchList = LobbyAPI.MatchList;

class LobbyClient {
  constructor(servers: Servers, activeGame: string | null) {
    this.servers = servers;
    this.activeGame = activeGame;
    this._lobbyClient = new BgioLobbyClient({ server: servers.lobby});
  }
  readonly servers: Servers;
  readonly activeGame: string | null;
  readonly _lobbyClient: BgioLobbyClient;

  createMatch(game: Game, numPlayers: number): Promise<CreatedMatch> {
    return this._lobbyClient.createMatch(game.name, {
      numPlayers: 2
    });

  }

  listMatches(game: Game) : Promise<MatchList> {
    return this._lobbyClient.listMatches(game.name);
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
