import React, { useState } from 'react';
import { AppGame } from '../app-game';
import { LobbyClient, MatchInfo } from './lobby-client';
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

interface ShowPlayerProps {
  game: AppGame;
  matchID: MatchID;
}

export function ShowPlayers({game, matchID} : ShowPlayerProps) {
  const [state, setState] = useState<MatchInfo|Error|'waiting'|null>(null);
  
  const lobbyClient = new LobbyClient(game, matchID);

  const refresh = () => {
    setState('waiting');
    lobbyClient.getActiveMatch().then(setState).catch(setState);
  }

  if (state === null) {  
    refresh();
    return null;
  }

  if(state === 'waiting') {
    return <div>waiting ...</div>;
  }

  if (state instanceof Error) {
    return <div>{`Error: ${state.message}`}</div>
  }  
  
  let players = [];
  let numWaiting = 0;
  for(const {name, id} of state.players) {
    if(name) {
      players.push(<div key={id}>{name}</div>);
    } else {
      ++numWaiting;
    }
  }
    
  return <div>
    {players}
    {numWaiting === 0 ? null :
      <div>{`waiting for ${numWaiting} player(s)`}</div>
    }
    <button type='button' onClick={refresh}>Refresh</button>
  </div>
}

interface JoinMatchProps {
  game: AppGame;
  matchID: MatchID;
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

  const lobbyClient = new LobbyClient(game, matchID);
  const join = () => {
    setProgress('waiting');
    lobbyClient.joinMatch(name).then(setPlayer).catch(setProgress);
  };

  return (
    <div>
      <div>
        <label>Name</label>
        <input value={name} placeholder='Player name' onInput={e => setName(e.currentTarget.value)} />
        <button type="button" onClick={join}>Join Game</button>
      </div>
    </div>);
} 

