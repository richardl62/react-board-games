import React, { useState } from 'react';
import { AppOptions, MatchID, Player, GameOptions } from './types';
import { AppGame } from '../app-game';
import { JoinMatch, ShowMatchInfo, StartMatch } from './lobby';
import { GamePlayLocal, GamePlayOnline } from './game-play';
import { getURLOptions, setURLMatchParams } from './url-options';
import { LobbyClient, MatchInfo } from './lobby-client';

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

  const [ player, setState ] = useState<Player|null>(localStorage.getPlayer(matchID));
  const [ matchInfo, setMatchInfo] = useState<MatchInfo|null>(null);
  const [ error, setError ] = useState<Error|null>(null);
  const [ onlineGameStarted, setOnlineGameStarted ] = useState(false);
  const { game } = props

  const gameOptions : GameOptions = {
    numPlayers: numPlayers,
    bgioDebugPanel: initialAppOptions.bgioDebugPanel,
  }
  const doStartMatch = (matchID: MatchID) => {
    setURLMatchParams(matchID);
  }

  const doSetPlayer = (p: Player) => {
    localStorage.setPlayer(matchID, p);
    setState(p);
    refreshMatchInfo();
  }

  const doStart = () => {
    setOnlineGameStarted(true);
  }

  const refreshMatchInfo = () => {
    const lobbyClient = new LobbyClient(game, matchID);
    lobbyClient.getActiveMatch().then(setMatchInfo).catch(setError);
  }

  if(!matchInfo && matchID.id) {
    refreshMatchInfo();
  }

  const matchStarted = Boolean(matchID.local || matchID.id);
  const waitingForPlayers = !matchInfo || matchInfo.players.find(p => !p.name);

  if (error) {
    console.log(error);
    return <div>`Error: ${error.message}`</div>
  } else if (!matchStarted) {
    return <StartMatch game={game} gameOptions={gameOptions} setMatch={doStartMatch}/>
  } else if (matchID.local) {
    return <GamePlayLocal game={game} gameOptions={gameOptions} />
  } else if (onlineGameStarted) {
    return <GamePlayOnline game={game} gameOptions={gameOptions} matchID={matchID} player={player!}/>
  } else if (!player) {
    return (<div>
      <JoinMatch game={game} matchID={matchID} setPlayer={doSetPlayer}/>
      <ShowMatchInfo matchInfo={matchInfo} />
    </div>);
  } else {
    return (<div>
        <ShowMatchInfo matchInfo={matchInfo} />
        <button type='button' onClick={refreshMatchInfo}>Refresh</button>
        {waitingForPlayers? null : 
          <button type='button' onClick={doStart}>Start Game</button>
        }
    </div>);
  }
}

export { GamePage };
