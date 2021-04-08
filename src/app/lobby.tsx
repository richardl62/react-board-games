import React, { useState } from 'react';
import { LobbyClient } from './lobby-client';
import { Player } from './types';

const numPlayersKludged = 2;


// Edited copy of JoinMatch
interface LobbyProps {
  lobbyClient: LobbyClient;
  setMatchAndPlayer: (matchID: string | null, player: Player |  null ) => void;
}
function CreateMatch({ lobbyClient, setMatchAndPlayer }: LobbyProps) {
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
    lobbyClient.createMatch(numPlayersKludged).then(match => setMatchAndPlayer(match.matchID, null)).catch(setProgress);
  }

  return <button type='button' onClick={onClick}>Start New Match</button>;
}

function JoinMatch({ lobbyClient, setMatchAndPlayer }: LobbyProps) {
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
    lobbyClient.joinMatch().then(player => setMatchAndPlayer(null, player)).catch(setProgress);
  }

  return <button type='button' onClick={onClick}>Join Game</button>;
}

function Lobby({ lobbyClient, setMatchAndPlayer }: LobbyProps) {

  if (lobbyClient.matchID) {
    return <JoinMatch lobbyClient={lobbyClient} setMatchAndPlayer={setMatchAndPlayer}/>;
  } else {
    return <CreateMatch lobbyClient={lobbyClient} setMatchAndPlayer={setMatchAndPlayer}/>;
  }
}

export default Lobby;
