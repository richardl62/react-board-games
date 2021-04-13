import { LobbyClient as BgioLobbyClient } from 'boardgame.io/client';
import { AppGame, Player } from './types';
import { LobbyAPI } from 'boardgame.io';
import { lobbyServer } from './url-options';

export type MatchInfo = LobbyAPI.Match;
export type CreatedMatch = LobbyAPI.CreatedMatch;
export type MatchList = LobbyAPI.MatchList;

export class LobbyClient {
  constructor(game: AppGame, matchID: string | null) {
    this.game = game;
    this._matchID = matchID;
    this._lobbyClient = new BgioLobbyClient({ server: lobbyServer() });
  }
  readonly game: AppGame;
  private _matchID: string | null;
  private _lobbyClient: BgioLobbyClient;

  get matchID() {return this._matchID};

  async createMatch(numPlayers: number): Promise<string> {
    const createdMatch = await this._lobbyClient.createMatch(this.game.name, {
      numPlayers: numPlayers
    });
    this._matchID = createdMatch.matchID;
    return createdMatch.matchID
  }

  async joinMatch(name: string | null): Promise<Player> {
    if (!this.matchID) {
      throw new Error("Active match not specificied");
    }
    const match = await this.getActiveMatch();
    console.log("Active match", match);

    const players = match.players;
    let index = 0;
    while (players[index].name) {
      ++index;
      if (index === players.length) {
        throw new Error("Match full - cannot join");
      }
    }

    const playerID = players[index].id.toString();
    const playerName = name || 'Player ' + playerID;

    const joinMatchResult = await this._lobbyClient.joinMatch(this.game.name, this.matchID,
      {playerID: playerID, playerName: playerName});

    console.log("joinMatchResult", joinMatchResult, ' for ', playerName);

    return {
      id: playerID,
      credentials: joinMatchResult.playerCredentials,
    }
  }

  getActiveMatch(): Promise<MatchInfo> {
    if (!this.matchID) {
      // Throw rather than failed promise as this is a usage error
      // rather than a network/server issue.
      throw new Error("active match not set");
    }
    return this._lobbyClient.getMatch(this.game.name, this.matchID);
  }

  getMatch(matchID: string): Promise<MatchInfo> {
    return this._lobbyClient.getMatch(this.game.name, matchID);
  }

  listMatches(): Promise<MatchList> {
    return this._lobbyClient.listMatches(this.game.name);
  }
}

