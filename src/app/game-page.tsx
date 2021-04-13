import React, { useState } from 'react';
import { AppOptions, Servers, Match, Player, GameOptions } from './types';
import { AppGame } from '../app-game';
import { JoinMatch, StartMatch } from './lobby';
import { GamePlayLocal, GamePlayOnline } from './game-play';
import { getURLOptions } from './url-options';

const appOptionsDefault: AppOptions = {
  playersPerBrowser: 1,
  bgioDebugPanel: false,
  match: {},
  player: null,
};

const initialAppOptions = { ...appOptionsDefault, ...getURLOptions() };

const numPlayers = 2; //KLUDGE

interface GamePageProps {
  game: AppGame;
  servers: Servers;
}

function GamePage(props: GamePageProps) {
  const [ appOptions, setAppOptions] = useState<AppOptions>(initialAppOptions);
  const { game, servers } = props
  const { match, player } = appOptions;

  const gameOptions : GameOptions = {
    numPlayers: numPlayers,
    bgioDebugPanel: initialAppOptions.bgioDebugPanel,
  }
  const setMatch = (match: Match) => {
    setAppOptions({...appOptions, match: match});
  }

  const setPlayer = (player: Player) => {
    setAppOptions({...appOptions, player: player});
  }

  if (match.local) {
    return <GamePlayLocal game={game} gameOptions={gameOptions} />
  } else if (match.id && player) {
    return <GamePlayOnline game={game} servers={servers}
      gameOptions={gameOptions} matchID={match.id} player={player} />;
  } else if (match.id) {
    return <JoinMatch game={game} servers={servers} matchID={match.id} 
      setPlayer={setPlayer} />
  } else {
    return <StartMatch game={game} servers={servers} gameOptions={gameOptions} setMatch={setMatch}/>
  }
}

export { GamePage };
