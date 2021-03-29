import React, {useState} from 'react';
import { LobbyClient } from 'boardgame.io/client';

export interface Player {
  id: string;
  credentials: string;
}

export interface Game {
  name: string;
}

interface LobbyProps {
  server: string;
  game: Game;
  matchID: string | null;
  player: Player | null;
  callback: (matchID: string, player?:Player) => void;
}

function createMatch(server : string, game: Game) {
  const lobbyClient = new LobbyClient({server: server});
  return lobbyClient.createMatch(game.name, { numPlayers: 2 });
}

async function joinMatch(server: string, game: Game, matchID: string) : Promise<Player> {
  const lobbyClient = new LobbyClient({server: server});

  const match = await lobbyClient.getMatch(game.name, matchID);
  console.log(match);

  const players = match.players;
  let index = 0; 
  while(index < players.length && players[index].name) {
    ++index;
  } 

  if(index === players.length) {
    throw new Error("Match full - cannot join");
  }
  
  const playerID = players[index].id.toString();
  const joinMatchResult = await lobbyClient.joinMatch(game.name, matchID, 
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

// Edited copy of JoinMatch
export function CreateMatch({server, game, callback} : LobbyProps) {
  const [progress, setProgress] = useState<null|'waiting'|Error>(null);

  if(progress === 'waiting') {
    return <div>waiting ...</div>
  }

  if(progress instanceof Error) {
    console.log("createMatch", progress);
    return <div>{`Error: ${progress.message}`}</div>
  }

  const onClick = () => {
    setProgress('waiting');
    createMatch(server, game).then(match => callback(match.matchID)).catch(setProgress);
  }

  return <button type='button' onClick={onClick}>Start New Match</button>;
}

export function JoinMatch({server, game, matchID, callback} : LobbyProps) {
  const [progress, setProgress] = useState<null|'waiting'|Error>(null);

  if (!matchID) {
    throw new Error("Attempt to join match without specifying match ID");
  }

  if(progress === 'waiting') {
    return <div>waiting ...</div>
  }

  if(progress instanceof Error) {
    console.log("createMatch", progress);
    return <div>{`Error: ${progress.message}`}</div>
  }

  const onClick = () => {
    setProgress('waiting');
    joinMatch(server, game, matchID).then(player => callback(matchID, player)).catch(setProgress);
  }

  return <button type='button' onClick={onClick}>Join Game</button>;
}

export function Lobby(props : LobbyProps ) {
    if(props.matchID) {
      return <JoinMatch {...props} />;
    } else {
      return <CreateMatch {...props}/>
    }
}
