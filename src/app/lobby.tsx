import React, { useState } from 'react';
import { AppGame } from '../app-game';
import { LobbyClient } from './lobby-client';
import { Servers, Player, Match } from './types';


const numPlayersKludged = 2;

// interface LobbyProps {
//   game: AppGame;
//   servers: Servers;

//   appOptions: AppOptions;
//   setAppOptions: SetAppOptions;
// }

// function Lobby({ game, servers, appOptions, setAppOptions }: LobbyProps) {
//   const [progress, setProgress] = useState<null | 'waiting' | Error>(null);

//   if(appOptions.playStatus !== null) {
//     throw new Error("Bad play status in lobby");
//   }

//   if (progress === 'waiting') {
//     return <div>waiting ...</div>
//   }

//   if (progress instanceof Error) {
//     console.log("createMatch", progress);
//     return <div>{`Error: ${progress.message}`}</div>
//   }

//   const { matchID } = appOptions;
//   const lobbyClient = new LobbyClient(game, servers, matchID);
//   const hasMatchID = Boolean(matchID);


//   const doJoin = async () => {
//     if (hasMatchID) {
//       setAppOptions({
//         player: await lobbyClient.joinMatch(),
//       })
//     } else {
//       setAppOptions({
//         matchID: await lobbyClient.createMatch(numPlayersKludged)
//       });
//     }
//   }

//   const onJoin = (args: any) => {
//     console.log("In onJoin: matchID", matchID, "player", appOptions.player);
//     setProgress('waiting');
//     doJoin().catch(setProgress);
//   }

//   return (<>
//     <div>
//       <label htmlFor="online">Online</label>
//       <input type="checkbox" id="online" name="online"/>
//     </div>
//     <button type="button" onClick={onJoin}>Join</button>
//   </>);
// }

interface StartMatchProps {
  game: AppGame;
  servers: Servers;
  setMatch: (match: Match) => void;
}
export function StartMatch({game, servers, setMatch} : StartMatchProps) {
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

    const lobbyClient = new LobbyClient(game, servers, null);
    lobbyClient.createMatch(numPlayersKludged).then(recordMatchID).catch(setProgress);
  };

  return <div>
      <span>Start Match: </span>
      <button type="button" onClick={startLocal}>Local</button>
      <button type="button" onClick={startOnline}>Online</button>
  </div>;
} 

interface JoinMatchProps {
  game: AppGame;
  servers: Servers;
  matchID: string;
  setPlayer: (arg: Player) => void;
}

export function JoinMatch({game, servers, matchID, setPlayer} : JoinMatchProps) {
  const [name, setName ] = useState<string>('');
  const [progress, setProgress] = useState<null | 'waiting' | Error>(null);

  if (progress === 'waiting') {
    return <div>waiting ...</div>
  }

  if (progress instanceof Error) {
    return <div>{`Error: ${progress.message}`}</div>
  }

  const join = () => {
    setProgress('waiting');

    const lobbyClient = new LobbyClient(game, servers, matchID);
    lobbyClient.joinMatch(name).then(setPlayer).catch(setProgress);
  };

  return (<div>
    <label>Name</label>
    <input value={name} placeholder='Player name' onInput={e => setName(e.currentTarget.value)}/>
    <button type="button" onClick={join}>Join Game</button>
  </div>);
} 

