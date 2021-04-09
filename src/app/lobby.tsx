import React, { useState } from 'react';
import { AppOptions } from './app-options';
import { LobbyClient } from './lobby-client';

const numPlayersKludged = 2;


// Edited copy of JoinMatch
interface LobbyProps {
  lobbyClient: LobbyClient;
  appOptions: AppOptions;
  setAppOptions: (opts: AppOptions) => void;
}

function Lobby({ lobbyClient, appOptions, setAppOptions }: LobbyProps) {
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
    const newAppOptions = {...appOptions};
    
    if(!hasMatchID) {
      newAppOptions.matchID = await lobbyClient.createMatch(numPlayersKludged);
    }
    newAppOptions.player = await lobbyClient.joinMatch();
    
    setAppOptions(newAppOptions);
  }
  const onClick = () => {
    setProgress('waiting');
    doJoin();
  }

  return <button type='button' onClick={onClick}>
      {hasMatchID ? 'Join Match' : 'Create Match'}
    </button>;
}

export default Lobby;
