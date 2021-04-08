import { Servers } from './types';
import { LobbyClient as BgioLobbyClient } from 'boardgame.io/client';
import { AppGame, Player } from './types';
import { LobbyAPI } from 'boardgame.io';

// async function joinMatch(server: string, game: AppGame, matchID: string) : Promise<Player> {
//   const lobbyClient = new LobbyClient({server: server});

//   const match = await lobbyClient.getMatch(game.name, matchID);
//   console.log(match);

//   const players = match.players;
//   let index = 0; 
//   while(index < players.length && players[index].name) {
//     ++index;
//   } 

//   if(index === players.length) {
//     throw new Error("Match full - cannot join");
//   }

//   const playerID = players[index].id.toString();
//   const joinMatchResult = await lobbyClient.joinMatch(game.name, matchID, 
//     {
//       playerID: playerID,
//       playerName: 'Player ' + playerID,
//     });

//   console.log("joinMatchResult", joinMatchResult);

//   return {
//     id: playerID,
//     credentials: joinMatchResult.playerCredentials,
//   }
// } 

export type Match = LobbyAPI.Match;
export type CreatedMatch = LobbyAPI.CreatedMatch;
export type MatchList = LobbyAPI.MatchList;
export class LobbyClient {
  constructor(game: AppGame, servers: Servers, matchID: string | null) {
    this.game = game;
    this.servers = servers;
    this.matchID = matchID;
    this._lobbyClient = new BgioLobbyClient({ server: servers.lobby });
  }
  readonly game: AppGame;
  readonly servers: Servers;
  readonly matchID: string | null;
  readonly _lobbyClient: BgioLobbyClient;

  createMatch(numPlayers: number): Promise<CreatedMatch> {
    return this._lobbyClient.createMatch(this.game.name, {
      numPlayers: numPlayers
    });
  }

  async joinMatch(): Promise<Player> {
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

    const joinMatchResult = await this._lobbyClient.joinMatch(this.game.name, this.matchID,
      {
        playerID: playerID,
        playerName: 'Player ' + playerID,
      });

    console.log("joinMatchResult", joinMatchResult);

    return {
      id: playerID,
      credentials: joinMatchResult.playerCredentials,
    }
  }

  getActiveMatch(): Promise<Match> {
    if (!this.matchID) {
      // Throw rather than failed promise as this is a usage error
      // rather than a network/server issue.
      throw new Error("active match not set");
    }
    return this._lobbyClient.getMatch(this.game.name, this.matchID);
  }

  getMatch(matchID: string): Promise<Match> {
    return this._lobbyClient.getMatch(this.game.name, matchID);
  }

  listMatches(): Promise<MatchList> {
    return this._lobbyClient.listMatches(this.game.name);
  }
}

