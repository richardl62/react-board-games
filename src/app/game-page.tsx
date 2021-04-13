import React, { useState } from 'react';
import { AppOptions, MatchID, Player, GameOptions } from './types';
import { AppGame } from '../app-game';
import { JoinMatch, ShowPlayers, StartMatch } from './lobby';
import { GamePlayLocal } from './game-play';
import { getURLOptions, setURLMatchParams } from './url-options';

const appOptionsDefault: AppOptions = {
  playersPerBrowser: 1,
  bgioDebugPanel: false,
  matchID: {},
  player: null,
};

const initialAppOptions = { ...appOptionsDefault, ...getURLOptions() };

const numPlayers = 2; //KLUDGE

const localStorageKey = (id: string) => `bgio-match-${id}`;

const localStorage = {
  setPlayer: (matchID: MatchID, player:Player) => { 
    if(!matchID.id) {
      throw new Error("Attempt to set player when match is not known");
    }
    const key = localStorageKey(matchID.id);  
    const json = JSON.stringify(player);

    window.localStorage.setItem(key, json);
  },

  getPlayer: (matchID: MatchID): Player | null => {
    if(matchID.id) {
      const key = localStorageKey(matchID.id);
      const json = window.localStorage.getItem(key);
    
      return json && JSON.parse(json);
    }

    return null;
  }
};

interface GamePageProps {
  game: AppGame;
}

function GamePage(props: GamePageProps) {
  const { matchID } = initialAppOptions;

  const [ player, setPlayerState ] = useState<Player|null>(localStorage.getPlayer(matchID));
  const { game } = props


  const gameOptions : GameOptions = {
    numPlayers: numPlayers,
    bgioDebugPanel: initialAppOptions.bgioDebugPanel,
  }
  const setMatch = (matchID: MatchID) => {
    setURLMatchParams(matchID);
  }

  const setPlayer = (player: Player) => {
    localStorage.setPlayer(matchID, player);
    setPlayerState(player);
  }

  const matchStarted = Boolean(matchID.local || matchID.id);

  if (!matchStarted) {
    return <StartMatch game={game} gameOptions={gameOptions} setMatch={setMatch}/>
  } else if (matchID.local) {
    return <GamePlayLocal game={game} gameOptions={gameOptions} />
  } else if (!player) {
    return (
      <div>
        <JoinMatch game={game} matchID={matchID} setPlayer={setPlayer} />
        <h2>Current Players</h2>
        <ShowPlayers game={game} matchID={matchID} />
      </div>);
  } else {
    return (
      <div>
        <h2>Waiting for other players</h2>
        <ShowPlayers game={game} matchID={matchID} />
      </div>
    )
  }
}

export { GamePage };
