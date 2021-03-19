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

interface GamePageProps {
  game: Game;
  playersPerBrowser: number;
  bgioDebugPanel: boolean;
}

type GamePageStatus = 'working' | {activePlayerID: number | null} | Error;

export function GamePage({ game, playersPerBrowser, bgioDebugPanel }: GamePageProps) {
  const lobbyClient = useLobbyClient();
  const [ status, setStatus ] = useState<GamePageStatus>('working');

  useEffect(() => {
    if(lobbyClient.activeMatch) {
      getActivePlayerID(lobbyClient).then(pid => {
        setStatus({ activePlayerID: pid })
      }).catch(setStatus);
    } else {
      setStatus({activePlayerID: null});
    }
  }, [lobbyClient])

  if(status === 'working') {
    return (<div>Working ...</div>);
  } 
  
  if (status instanceof Error) {
    return (<div>{"Error: " + status.message}</div>)
  }
  
  const numPlayers = 2; //KLUDGE
  const server = lobbyClient.activeMatch && lobbyClient.servers.lobby;
  const playerID = status.activePlayerID || 1;
  const matchID = lobbyClient.activeMatch || undefined;

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
        layerID={playerID.toString()}
      />
    
      <GameLobby game={game}/>
    </div>
  );
}
