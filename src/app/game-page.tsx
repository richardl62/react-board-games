import { useEffect, useState } from 'react';
import { nonNull } from '../tools';
import styles from './app.module.css';
import { Game } from "./types";
import { GameLobby } from './game-lobby';
import { LobbyClient, useLobbyClient } from './lobby-client';
import { GameClient } from './game-client';

// function getPlayerID(lobbyClient: LobbyClient) {
//   if (lobbyClient.activeMatch) {

//     (async () => await lobbyClient.getActiveMatch().then(match => 
//       console.log("getPlayerID", match)))();
//   } else {
//     console.log("No active match");
//   }

//   console.log("goodbye");
//   return 1;
// }

async function getActivePlayerID(lobbyClient: LobbyClient) {
  // let result: number| Error;
  // await lobbyClient.getActiveMatch().then(() => result = 1)
  //   .catch(err => result = err);
  // console.log(result);
  return 1;
}

interface GamePlayProps {
  game: Game;
  bgioDebugPanel: boolean;
  matchID: string;
  playerID: number;
  server: string;
}
function GamePlay({ game, bgioDebugPanel,  playerID, matchID, server }: GamePlayProps) {

  const numPlayers = 2; //KLUDGE

  const Client = GameClient({
    game: game,
    numPlayers: numPlayers,
    bgioDebugPanel: bgioDebugPanel,
    server: server,
  });

  return (
    <div className={nonNull(styles.gamePage)}>
      <Client
        matchID={matchID}
        playerID={playerID.toString()}
      />
    </div>
  );
}

interface GamePageProps {
  game: Game;
  playersPerBrowser: number;
  bgioDebugPanel: boolean;
}

export function GamePage({game, bgioDebugPanel}: GamePageProps) {
  type GamePageStatus = 'working' | { playerID: number } | Error;

  const lobbyClient = useLobbyClient();
  const [status, setStatus] = useState<GamePageStatus>('working');

  useEffect(() => {
    getActivePlayerID(lobbyClient).then(pid => {
      setStatus({ playerID: pid })
    }).catch(err => setStatus(err));
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
