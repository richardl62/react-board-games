import { LobbyClient } from 'boardgame.io/client'
import {Servers} from '../options';
import { gamePath } from '../../url-tools'
export type GameStatus = 'open' | 'started' | 'finished';

const serverHack = " http://localhost:8000/"
export interface OnlineGame {
    name: string; // Name of the game, e.g. 'chessaside'.
    id: string;   // ID of an individual game.
    address: string; // Link address from the individual game.
    status: GameStatus;
}

let games: Array<OnlineGame> = []; 

games = [
  {name:'bobail', id:'b1', address:'/xxx', status:'open'},
  {name:'bobail', id:'b2', address:'/xxx', status:'started'},
  {name:'chess', id:'c1', address:'/yyy', status:'finished'},
  ];

export function onlineGames(servers: Servers) : Array<OnlineGame>  { 

    console.log("Lobby running on ", servers);


    const lobbyClient = new LobbyClient({ server: servers.lobby});
    
    lobbyClient.listGames()
      .then(console.log)
      .catch(console.error);
      
    return games;
}

function createMatch(lobbyClient: LobbyClient) : string {
  lobbyClient.createMatch('bobail', {
    numPlayers: 2
  }).then(console.log)
  .catch(console.error);

  return "dummy";
}

export function startNewGame(name: string) : OnlineGame {
  const lobbyClient = new LobbyClient({ server: serverHack});
  const matchID  = createMatch(lobbyClient);
  const game : OnlineGame = {
    name:name,
    id: matchID,
    address:gamePath(name) + "?id=" + matchID,
    status: 'open',
  }
console.log(games);
  games.push(game);

  return game;
} 


