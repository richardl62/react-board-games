import React, { ReactChild, useState } from 'react';
import { MatchID, Player, AppGame } from '../shared/types';
import { GamePlayOnline, GamePlayLocal } from './game-play';
import * as LobbyClient from '../shared/bgio';
import { openMatchPage } from './url-params';
import { getStoredPlayer, setStoredPlayer } from './local-storage';
import { MatchOptions, StartMatchOptions } from './start-match-options';
import assert from '../shared/assert';

interface GetPlayerNameProps {
  children: ReactChild;
  nameCallback: (arg: string) => void;
}

function GetPlayerName({children: child, nameCallback}: GetPlayerNameProps) {

  const [name, setName] = useState<string>('');
  return (
    <div>
      <div>
        <label>Name</label>
        <input 
          value={name} 
          placeholder='Player name' 
          onInput={e => setName(e.currentTarget.value)} 
        />

        <button 
          type="button"
          onClick={() => nameCallback(name)}
        >
          {child}
        </button>

      </div>
    </div>);
}

interface GamePageProps {
  game: AppGame;
  matchID: MatchID | null;
}

function GamePage({game, matchID}: GamePageProps) {
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<Error|null>(null);
  const [matchOptions, setMatchOptions] = useState<MatchOptions|null>(null);
  const [player, setPlayer] = useState<Player|null>(matchID && getStoredPlayer(matchID));
  
  const processMatchOptions = (matchOptions : MatchOptions) => {
    if (matchOptions.local) {
      setMatchOptions(matchOptions);
    } else {
      setWaiting(true);
      LobbyClient.createMatch(game, matchOptions.nPlayers)
        .then(openMatchPage)
        .catch(setError);
    }
  }

  const joinGame = (name: string) => {
    assert(matchID);
    setWaiting(true);

    LobbyClient.joinMatch(game, matchID, name)
      .then(player => {
        setStoredPlayer(matchID, player);
        setPlayer(player);
        setWaiting(false);
      })
      .catch(setError);
  }

  if (error) {
    return <div>{`Error contacting server (${error.message})`}</div>
  }

  if (waiting) {
    return <div>Waiting for server ...</div>;
  }

  if (matchID && !player) {
    return <GetPlayerName nameCallback={joinGame}>Join As</GetPlayerName>
  }

  if (matchID && player) {
    return  <GamePlayOnline game={game} matchID={matchID} player={player} />
  }

  if (!matchOptions) {
    return <StartMatchOptions game={game} optionsCallback={processMatchOptions} />
  }
  
  if(matchOptions.local) {
    return <GamePlayLocal game={game} numPlayers={matchOptions.nPlayers} />
  }

  throw new Error("Problem with GamePage")
}

export { GamePage };
