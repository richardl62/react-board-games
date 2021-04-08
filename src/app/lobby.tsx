import React, { useState } from 'react';
import { LobbyClient } from './lobby-client';
import { AppGame } from '../app-game';
import { Servers } from './types';
import AppOptions from './app-options';

const numPlayersKludged = 2;

interface LobbyProps {
  servers: Servers;
  game: AppGame;
  options: AppOptions;
}

// Edited copy of JoinMatch
interface CreateMatchProps {
  lobbyClient: LobbyClient;
  options: AppOptions;
}
function CreateMatch({ lobbyClient, options }: CreateMatchProps) {
  const [progress, setProgress] = useState<null | 'waiting' | Error>(null);

  if (progress === 'waiting') {
    return <div>waiting ...</div>
  }

  if (progress instanceof Error) {
    console.log("createMatch", progress);
    return <div>{`Error: ${progress.message}`}</div>
  }

  const onClick = () => {
    setProgress('waiting');
    lobbyClient.createMatch(numPlayersKludged).then(match => options.matchID = match.matchID).catch(setProgress);
  }

  return <button type='button' onClick={onClick}>Start New Match</button>;
}

function JoinMatch({ lobbyClient, options }: CreateMatchProps) {
  const [progress, setProgress] = useState<null | 'waiting' | Error>(null);

  const matchID = options.matchID;

  if (!matchID) {
    throw new Error("Attempt to join match without specifying match ID");
  }

  if (progress === 'waiting') {
    return <div>waiting ...</div>
  }

  if (progress instanceof Error) {
    console.log("createMatch", progress);
    return <div>{`Error: ${progress.message}`}</div>
  }

  const onClick = () => {
    setProgress('waiting');
    lobbyClient.joinMatch().then(player => options.player = player).catch(setProgress);
  }

  return <button type='button' onClick={onClick}>Join Game</button>;
}

function Lobby({game, servers, options }: LobbyProps) {
  const { matchID } = options;

  const lobbyClient = new LobbyClient(game, servers, matchID);
  if (matchID) {
    return <JoinMatch lobbyClient={lobbyClient} options={options}/>;
  } else {
    return <CreateMatch lobbyClient={lobbyClient} options={options}/>;
  }
}

export default Lobby;
