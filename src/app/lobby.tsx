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

interface JoinMatchProps {
  game: AppGame;
  matchID: MatchID;
  setPlayer: (arg: Player) => void;
}

export function JoinMatch({game, matchID, setPlayer} : JoinMatchProps) {
  const [name, setName ] = useState<string>('');
  const [progress, setProgress] = useState<null | 'waiting' | 'joined' | Error>(null);

  if (progress === 'waiting') {
    return <div>waiting ...</div>
  }

  if (progress === 'joined') {
    return <div>Joined</div>
  }
  if (progress instanceof Error) {
    return <div>{`Error: ${progress.message}`}</div>
  }

  const lobbyClient = new LobbyClient(game, matchID);
  const join = () => {
    setProgress('waiting');
    lobbyClient.joinMatch(name).then(
        p => {setPlayer(p); setProgress('joined')}
      ).catch(setProgress);
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


interface ShowMatchInfoProps {
  matchInfo: MatchInfo | null;
}

export function ShowMatchInfo({matchInfo} : ShowMatchInfoProps) {
  if(!matchInfo) {
    return (<div>Match information not currently available</div>);
  }

  const players = matchInfo.players;
  let playerElems = [];
  for(const {name, id} of players) {
    if(name) {
      playerElems.push(<div key={id}>{name}</div>);
    }
  }
    
  return (<div>
    <h2>{`Current Players (${players.length} required)`}</h2>
    {playerElems}
  </div>);
}
