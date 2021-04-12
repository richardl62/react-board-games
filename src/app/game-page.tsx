import React from 'react';
import { AppOptions, Servers, SetAppOptions } from './types';
import { AppGame } from '../app-game';
import Lobby from './lobby';
import { GamePlayLocal, GamePlayOnline } from './game-play';

const numPlayers = 2; //KLUDGE
interface GamePageProps {
  game: AppGame;

  appOptions: AppOptions;
  setAppOptions: SetAppOptions;

  servers: Servers;
}

function GamePage(props: GamePageProps) {
  const {game, appOptions, servers } = props;
  const { playStatus, matchID, player } = appOptions;

  if (playStatus === 'local') {
    return <GamePlayLocal game={game} numPlayers={numPlayers}/>
  } else if (playStatus === 'online') {
    if(!(matchID && player)) {
      throw new Error("matchID and player are not both set");
    }
    return <GamePlayOnline game={game} servers={servers} numPlayers={numPlayers}
      matchID={matchID} player={player} />;
  } else {
    return <Lobby {...props}/>
  }
}

export { GamePage };
