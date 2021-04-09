import React, { useState } from 'react';
import { AppGame } from '../app-game';
import { LobbyClient } from './lobby-client';
import { Player, Servers } from './types';

const numPlayersKludged = 2;

interface LobbyProps {
  game: AppGame;
  servers: Servers;

  matchID: string | null;
  setMatchID: (arg: string) => void;
  player: Player | null;
  setPlayer: (arg: Player) => void
}

function Lobby({ game, servers, matchID, setMatchID, player, setPlayer} : LobbyProps) {
  const lobbyClient = new LobbyClient(game, servers, matchID);
  
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
      setPlayer(await lobbyClient.joinMatch())
    } else {
      setMatchID(await lobbyClient.createMatch(numPlayersKludged));
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
