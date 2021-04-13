import React, { useState } from 'react';
import { AppOptions, Match, Player, GameOptions } from './types';
import { AppGame } from '../app-game';
import { JoinMatch, StartMatch } from './lobby';
import { GamePlayLocal, GamePlayOnline } from './game-play';
import { getURLOptions, setURLMatchParams } from './url-options';

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
}

function GamePage(props: GamePageProps) {
  const [ player, setPlayer ] = useState<Player|null>(null);
  const { game } = props
  const { match } = initialAppOptions;

  const gameOptions : GameOptions = {
    numPlayers: numPlayers,
    bgioDebugPanel: initialAppOptions.bgioDebugPanel,
  }
  const setMatch = (match: Match) => {
    setURLMatchParams(match);
  }

  if (match.local) {
    return <GamePlayLocal game={game} gameOptions={gameOptions} />
  } else if (match.id && player) {
    return <GamePlayOnline game={game} gameOptions={gameOptions} 
      matchID={match.id} player={player} />;
  } else if (match.id) {
    return <JoinMatch game={game} matchID={match.id} 
      setPlayer={setPlayer} />
  } else {
    return <StartMatch game={game} gameOptions={gameOptions} setMatch={setMatch}/>
  }
}

export { GamePage };
