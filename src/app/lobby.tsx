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

function Lobby({ game, servers, appOptions, setAppOptions }: LobbyProps) {
  const [progress, setProgress] = useState<null | 'waiting' | Error>(null);

  if(appOptions.playStatus !== null) {
    throw new Error("Bad play status in lobby");
  }

  if (progress === 'waiting') {
    return <div>waiting ...</div>
  }

  if (progress instanceof Error) {
    console.log("createMatch", progress);
    return <div>{`Error: ${progress.message}`}</div>
  }

  const { matchID } = appOptions;
  const lobbyClient = new LobbyClient(game, servers, matchID);
  const hasMatchID = Boolean(matchID);


  const doJoin = async () => {
    if (hasMatchID) {
      setAppOptions({
        player: await lobbyClient.joinMatch(),
      })
    } else {
      setAppOptions({
        matchID: await lobbyClient.createMatch(numPlayersKludged)
      });
    }
  }

  const onJoin = (args: any) => {
    console.log("In onJoin: matchID", matchID, "player", appOptions.player);
    setProgress('waiting');
    doJoin().catch(setProgress);
  }

  return (<>
    <div>
      <label htmlFor="online">Online</label>
      <input type="checkbox" id="online" name="online"/>
    </div>
    <button type="button" onClick={onJoin}>Join</button>
  </>);
}

export default Lobby;
