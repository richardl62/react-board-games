import React, {useState} from 'react';
import { LobbyClient } from 'boardgame.io/client';
import { AppGame } from '../app-game';
import { Player, Servers } from './types';
import AppOptions from './app-options';

interface LobbyProps {
  servers: Servers;
  game: AppGame;
  options: AppOptions;
}

function createMatch(server : string, game: AppGame) {
  const lobbyClient = new LobbyClient({server: server});
  return lobbyClient.createMatch(game.name, { numPlayers: 2 });
}

async function joinMatch(server: string, game: AppGame, matchID: string) : Promise<Player> {
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
function CreateMatch({servers, game, options} : LobbyProps) {
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
    createMatch(servers.lobby, game).then(match => options.matchID = match.matchID).catch(setProgress);
  }

  return <button type='button' onClick={onClick}>Start New Match</button>;
}

function JoinMatch({servers, game, options} : LobbyProps) {
  const [progress, setProgress] = useState<null|'waiting'|Error>(null);

  const matchID = options.matchID;

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
    joinMatch(servers.lobby, game, matchID).then(player => options.player = player).catch(setProgress);
  }

  return <button type='button' onClick={onClick}>Join Game</button>;
}

function Lobby(props : LobbyProps ) {
    if(props.options.matchID) {
      return <JoinMatch {...props} />;
    } else {
      return <CreateMatch {...props}/>
    }
}

export default Lobby;
