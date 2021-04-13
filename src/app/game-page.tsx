import React, { useState } from 'react';
import { AppOptions, MatchID, Player, GameOptions } from './types';
import { AppGame } from '../app-game';
import { JoinMatch, StartMatch } from './lobby';
import { GamePlayLocal, GamePlayOnline } from './game-play';
import { getURLOptions, setURLMatchParams } from './url-options';

const appOptionsDefault: AppOptions = {
  playersPerBrowser: 1,
  bgioDebugPanel: false,
  matchID: {},
  player: null,
};

const initialAppOptions = { ...appOptionsDefault, ...getURLOptions() };

const numPlayers = 2; //KLUDGE

interface GamePageProps {
  game: AppGame;
}

class LocalStorage {
  constructor(matchID: string) {
    this.key = `bgio-match-${matchID}`;
  }
  private key : string; 

  set player(p: Player | null) {
    const json = JSON.stringify(p)
    window.localStorage.setItem(this.key, json);
  }

  get player(): Player | null {
    const json = window.localStorage.getItem(this.key);
    
    const p = json && JSON.parse(json)
    console.log("player from local storage:", p);
    
    return p;
  }
};

function GamePage(props: GamePageProps) {
  const { matchID } = initialAppOptions;
  const localStorage = matchID.id && new LocalStorage(matchID.id);
  const [ player, setPlayerState ] = useState<Player|null>(localStorage ? localStorage.player : null);
  const { game } = props


  const gameOptions : GameOptions = {
    numPlayers: numPlayers,
    bgioDebugPanel: initialAppOptions.bgioDebugPanel,
  }
  const setMatch = (matchID: MatchID) => {
    setURLMatchParams(matchID);
  }

  const setPlayer = (player: Player) => {
    if(localStorage) {
      localStorage.player = player;
    }

    setPlayerState(player);
  }

  if (matchID.local) {
    return <GamePlayLocal game={game} gameOptions={gameOptions} />
  } else if (matchID.id && player) {
    return <GamePlayOnline game={game} gameOptions={gameOptions} 
      matchID={matchID.id} player={player} />;
  } else if (matchID.id) {
    return <JoinMatch game={game} matchID={matchID.id} 
      setPlayer={setPlayer} />
  } else {
    return <StartMatch game={game} gameOptions={gameOptions} setMatch={setMatch}/>
  }
}

export { GamePage };
