import { Servers } from './types';
import { LobbyClient as BgioLobbyClient} from 'boardgame.io/client';
import { Game, Player } from './types';
import { LobbyAPI } from 'boardgame.io';

export type Match = LobbyAPI.Match;
export type CreatedMatch = LobbyAPI.CreatedMatch;
export type MatchList = LobbyAPI.MatchList;
export class LobbyClient {
  constructor(game: Game, servers: Servers, matchID: string | null) {
    this.game = game;
    this.servers = servers;
    this.matchID = matchID;
    this._lobbyClient = new BgioLobbyClient({ server: servers.lobby});
  }
  readonly game: Game;
  readonly servers: Servers;
  readonly matchID: string | null;
  readonly _lobbyClient: BgioLobbyClient;

  createMatch(numPlayers: number): Promise<CreatedMatch> {
    return this._lobbyClient.createMatch(this.game.name, {
      numPlayers: numPlayers
    });
  }

  getActiveMatch() : Promise<Match> {
    if(!this.matchID) {
      // Throw rather than failed promise as this is a usage error
      // rather than a network/server issue.
      throw new Error("active match not set");
    }
    return this._lobbyClient.getMatch(this.game.name, this.matchID);
  }

  getMatch(matchID: string) : Promise<Match> {
    return this._lobbyClient.getMatch(this.game.name, matchID);
  }

  listMatches() : Promise<MatchList> {
    return this._lobbyClient.listMatches(this.game.name);
  }

  async joinMatch() : Promise<Player> {
    if(!this.matchID) {
      throw new Error("Active match not specificied");
    }
    const match = await this.getActiveMatch();
    console.log("Active match", match);

    const playerID = match.players[0].id.toString();  //TEMPORARY KLUDGE
 
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
}

