import { useEffect, useState } from 'react';
import { GameLobby } from './game-lobby';
import { LobbyClient, useLobbyClient } from './lobby-client';
import { GamePageProps, GamePlay } from './game-play';


async function joinMatch(lobbyClient: LobbyClient) : Promise<number> {
  const match = await lobbyClient.getActiveMatch();
  console.log(match.players);
  for(let ii = 0; ii < match.players.length; ++ii) {
    if(!match.players[ii].name) {
      await lobbyClient.joinActiveMatch(match.players[ii].id.toString());
      return match.players[ii].id;
    }
  }
  throw new Error(`Player cannot join match`);
}

export function GamePage({game, bgioDebugPanel}: GamePageProps) {
  const lobbyClient = useLobbyClient();
  
  type GamePageStatus = 'working' | { playerID: number } | Error;


  const [status, setStatus] = useState<GamePageStatus>('working');
  console.log("GamePage status:", status);
  useEffect(() => {
    if (lobbyClient.activeMatch) {
      console.log("Attempt to join match");
      joinMatch(lobbyClient).then(pid => {
        setStatus({ playerID: pid })
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
    playerID={status.playerID}
    server={lobbyClient.servers.lobby}
  />);

}
