import { LobbyClient as BgioLobbyClient } from 'boardgame.io/client';
import { AppGame, MatchID, Player } from './types';
import { LobbyAPI } from 'boardgame.io';
import { lobbyServer } from './url-options';

export type MatchInfo = LobbyAPI.Match;
export type PublicPlayerInfo = MatchInfo['players'][0];
export type CreatedMatch = LobbyAPI.CreatedMatch;
export type MatchList = LobbyAPI.MatchList;


export class LobbyClient {
  constructor(game: AppGame, matchID: MatchID | null) {
  
    this.game = game;
    this._matchID = matchID;
    this._lobbyClient = new BgioLobbyClient({ server: lobbyServer() });
  }
  readonly game: AppGame;
  private _matchID: MatchID | null;
  private _lobbyClient: BgioLobbyClient;

  get matchID() {return this._matchID};

  async createMatch(numPlayers: number): Promise<string> {
    const createdMatch = await this._lobbyClient.createMatch(this.game.name, {
      numPlayers: numPlayers
    });
    this._matchID = {mid: createdMatch.matchID};
    return createdMatch.matchID
  }

  async joinMatch(name: string | null): Promise<Player> {
    if (!this.matchID || !this.matchID.mid) {
      throw new Error("Active online match not known");
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

    const joinMatchResult = await this._lobbyClient.joinMatch(this.game.name, this.matchID.mid,
      {playerID: playerID, playerName: playerName});

    console.log("joinMatchResult", joinMatchResult, ' for ', playerName);

    return {
      id: playerID,
      credentials: joinMatchResult.playerCredentials,
    }
  }

  getActiveMatch(): Promise<MatchInfo> {
    if (!this.matchID || !this.matchID.mid) {
      // Throw rather than failed promise as this is a usage error
      // rather than a network/server issue.
      throw new Error("active match not set");
    }
    return this._lobbyClient.getMatch(this.game.name, this.matchID.mid);
  }

  // Unsucessful attempt
  //
  // // Return a promise that is forfilled the set of players is different from
  // // those recorded in knownPlayers. (Typically, this occurs when a player joins
  // // or leaves. 
  // getPlayerChange(knownPlayers: MatchInfo | null): Promise<MatchInfo> {

  //   return new Promise<MatchInfo>((resolve, reject) => {
  //     const conditionalResolve = (mi: MatchInfo) => {
  //         const same = knownPlayers && samePlayers(knownPlayers, mi);
  //         console.log((same? "Same: " : "Different: "), knownPlayers, mi)

  //         if(!same) {
  //           resolve(mi);
  //         }
  //     }
      
  //     const doit = () => {
  //       this.getActiveMatch().then(conditionalResolve, reject);
  //     }
  //     setInterval(doit, 2000);
  //   })
  // }

  getMatch(matchID: string): Promise<MatchInfo> {
    return this._lobbyClient.getMatch(this.game.name, matchID);
  }

  listMatches(): Promise<MatchList> {
    return this._lobbyClient.listMatches(this.game.name);
  }
}

