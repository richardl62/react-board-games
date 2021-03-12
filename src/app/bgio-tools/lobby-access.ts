import { Servers } from '../types';
import { LobbyClient } from 'boardgame.io/client';
import { gamePath } from '../../url-tools';
import { OnlineGame, Game } from '../types';


export class LobbyAccess {
  constructor(servers: Servers, activeGame: string | null) {
    this.servers = servers;
    this.activeGame = activeGame;
    this._lobbyClient = new LobbyClient({ server: servers.lobby});
  }
  readonly servers: Servers;
  readonly activeGame: string | null;
  readonly _lobbyClient: LobbyClient;

  createMatch(game: Game, numPlayers: number): OnlineGame {
    const { name } = game;
    const promise = this._lobbyClient.createMatch(name, {
      numPlayers: 2
    });
    
    promise.then(console.log).catch(console.error);
    let matchId = "dummy";
    
    const result: OnlineGame = {
      name: name,
      id: matchId,
      address: gamePath(name) + "?id=" + matchId,
      status: 'open',
    };
  
    console.log("started new game:", result);
    this.listMatches([game]);
    return result;
  }

    listMatches(games: Array<Game>) : Array<OnlineGame> {
    const doAwait = async () => (await this._lobbyClient.listMatches(games[0].name)).matches;
    const matches = doAwait();
    console.log("list matches", matches);

    return [];
  }
}
