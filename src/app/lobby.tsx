import React, { useState } from 'react';
import { LobbyClient } from './lobby-client';
import { Player } from './types';

const numPlayersKludged = 2;


// Edited copy of JoinMatch
interface LobbyProps {
  lobbyClient: LobbyClient;
  setMatchAndPlayer: (matchID: string | null, player: Player |  null ) => void;
}

function Lobby({ lobbyClient, setMatchAndPlayer }: LobbyProps) {
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
    let matchID = null;
    if(!hasMatchID) {
      matchID = await lobbyClient.createMatch(numPlayersKludged);
    }
    const player = await lobbyClient.joinMatch();
    
    setMatchAndPlayer(matchID, player);
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
