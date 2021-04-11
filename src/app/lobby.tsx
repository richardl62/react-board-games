import React, { useState } from 'react';
import { AppGame } from '../app-game';
import { LobbyClient } from './lobby-client';
import { AppOptions, Servers, SetAppOptions } from './types';

const numPlayersKludged = 2;

interface LobbyProps {
  game: AppGame;
  servers: Servers;

  appOptions: AppOptions;
  setAppOptions: SetAppOptions;
}

function Lobby({ game, servers, appOptions, setAppOptions} : LobbyProps) {
  const lobbyClient = new LobbyClient(game, servers, appOptions.matchID);
  
  const [progress, setProgress] = useState<null | 'waiting' | Error>(null);

  if (progress === 'waiting') {
    return <div>waiting ...</div>
  }

  if (progress instanceof Error) {
    console.log("createMatch", progress);
    return <div>{`Error: ${progress.message}`}</div>
  }

  const hasMatchID = Boolean(lobbyClient.matchID);

  const doJoin = async () => {    
    if(hasMatchID) {
      setAppOptions({
        ...appOptions,
        player: await lobbyClient.joinMatch(),
      })
    } else {
      setAppOptions({
        ...appOptions,
        matchID: await lobbyClient.createMatch(numPlayersKludged)
      });
    }
  }
  const onClick = () => {
    setProgress('waiting');
    doJoin().catch(setProgress);
  }

  return <button type='button' onClick={onClick}>
      {hasMatchID ? 'Join Match' : 'Create Match'}
    </button>;
}

export default Lobby;
