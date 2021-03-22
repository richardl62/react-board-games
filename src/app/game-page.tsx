import { useEffect, useState } from 'react';
import { Game } from './types'
import { GameLobby } from './game-lobby';

import { LobbyClient, useLobbyClient } from './lobby-client';
import { GamePlay, Player } from './game-play';


async function joinMatch(lobbyClient: LobbyClient) : Promise<Player> {
  const match = await lobbyClient.getActiveMatch();
  console.log(match.players);
  for(let ii = 0; ii < match.players.length; ++ii) {
    const id = match.players[ii].id.toString();
    if(!match.players[ii].name) {
      const { playerCredentials } = await lobbyClient.joinActiveMatch(id);
      return {id: id, credentials: playerCredentials};
    }
  }
  throw new Error(`Player cannot join match`);
}

export interface GamePageProps {
  game: Game;
  bgioDebugPanel: boolean;
}

export function GamePage({game, bgioDebugPanel}: GamePageProps) {
  const lobbyClient = useLobbyClient();
  
  type GamePageStatus = 'working' | { player: Player } | Error;


  const [status, setStatus] = useState<GamePageStatus>('working');
  console.log("GamePage status:", status);
  useEffect(() => {
    if (lobbyClient.activeMatch) {
      console.log("Attempt to join match");
      joinMatch(lobbyClient).then(player => {
        setStatus({player: player})
      }).catch(err => setStatus(err));
    } 
  }, [lobbyClient])

  const matchID = lobbyClient.activeMatch;
  if(!matchID) {
    return <GameLobby game={game} />;
  }

  if (status === 'working') {
    return (<div>Working ...</div>);
  }

  if (status instanceof Error) {
    return (<div>{"Error: " + status.message}</div>)
  }

  return (<GamePlay 
    game={game}
    bgioDebugPanel={bgioDebugPanel}
    matchID={matchID}
    player={status.player}
    server={lobbyClient.servers.lobby}
  />);

}
