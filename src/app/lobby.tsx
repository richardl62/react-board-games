import React, { useState } from 'react';
import { AppGame } from '../app-game';
import { LobbyClient } from './lobby-client';
import { Player, MatchID, GameOptions } from './types';

interface StartMatchProps {
  game: AppGame;
  gameOptions: GameOptions;
  setMatch: (matchID: MatchID) => void;
}
export function StartMatch({game,  gameOptions, setMatch} : StartMatchProps) {
  const [progress, setProgress] = useState<null | 'waiting' | Error>(null);

  if (progress === 'waiting') {
    return <div>waiting ...</div>
  }

  if (progress instanceof Error) {
    return <div>{`Error: ${progress.message}`}</div>
  }

  const startLocal = () => {setMatch({local: true})};
  const startOnline = () => {
    setProgress('waiting');
    const recordMatchID = (id: string) => {setMatch({id: id})};

    const lobbyClient = new LobbyClient(game, null);
    lobbyClient.createMatch(gameOptions.numPlayers).then(recordMatchID).catch(setProgress);
  };

  return <div>
      <span>Start Match: </span>
      <button type="button" onClick={startLocal}>Local</button>
      <button type="button" onClick={startOnline}>Online</button>
  </div>;
} 

interface JoinMatchProps {
  game: AppGame;
  matchID: string;
  setPlayer: (arg: Player) => void;
}

export function JoinMatch({game, matchID, setPlayer} : JoinMatchProps) {
  const [name, setName ] = useState<string>('');
  const [progress, setProgress] = useState<null | 'waiting' | Error>(null);

  if (progress === 'waiting') {
    return <div>waiting ...</div>
  }

  if (progress instanceof Error) {
    return <div>{`Error: ${progress.message}`}</div>
  }

  const join = () => {
    setProgress('waiting');

    const lobbyClient = new LobbyClient(game, matchID);
    lobbyClient.joinMatch(name).then(setPlayer).catch(setProgress);
  };

  return (<div>
    <label>Name</label>
    <input value={name} placeholder='Player name' onInput={e => setName(e.currentTarget.value)}/>
    <button type="button" onClick={join}>Join Game</button>
  </div>);
} 

