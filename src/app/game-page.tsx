import React, { useState } from 'react';
import { MatchID, Player, AppGame } from '../shared/types';
import * as GamePlay from './game-play';
import * as LobbyClient  from '../shared/bgio';
import { openMatchPage } from './url-params';
import { getStoredPlayer, setStoredPlayer } from './local-storage';
import { useStatePromise } from '../shared/tools';
import assert from 'assert';

interface StartMatchProps {
  game: AppGame;
  numPlayers: (arg: number) => void;
}

function NumPlayers(props : StartMatchProps) {
  const game = props.game;
  const numPlayersCallback = props.numPlayers;

  const [ numPlayers, setNumPlayers ] = useState<number>(game.minPlayers);
  const { minPlayers, maxPlayers } = game;

  if (minPlayers === maxPlayers) {
    numPlayersCallback(minPlayers);
    return null;
  }

  return (<div>
    <label htmlFor='numPlayers'>
      {`Number of players (${minPlayers}-${maxPlayers}):`}
    </label>
    <input type="number" name='numPlayers'
      min={minPlayers} max={maxPlayers} value={numPlayers}
      onChange={(event) => setNumPlayers(Number(event.target.value))}
    />
    <button type="button" onClick={()=>numPlayersCallback(numPlayers)}>Start Game</button>

  </div>);
}

interface JoinMatchProps {
  joinMatch: (arg: string) => void;
}

function JoinMatch({ joinMatch }: JoinMatchProps) {
  const [name, setName] = useState<string>('');
  return (
    <div>
      <div>
        <label>Name</label>
        <input value={name} placeholder='Player name' onInput={e => setName(e.currentTarget.value)} />

        <button type="button" onClick={() => joinMatch(name)}>
          Join Game
          </button>

      </div>
    </div>);
}

interface GamePageProps {
  game: AppGame;
  matchID: MatchID | null;
}

function GamePage(props: GamePageProps) {
  // KLUDGE: This function is hard to understand   
  const { game } = props;  
  const [error, setError] = useState<Error | null>(null);
  const [local, setLocal] = useState<boolean>(false);
  const player = useStatePromise<Player>();
  const numPlayers = useStatePromise<number>();
  const matchID = useStatePromise<MatchID>(props.matchID);

  if(local) {
    return <GamePlay.Local game={game} />
  }

  const storedPlayer = matchID.fulfilled && getStoredPlayer(matchID.value);
  
  if(storedPlayer && player.unset) {
    player.value = storedPlayer;
  }

  if(matchID.fulfilled && numPlayers.unset) {
    const p = LobbyClient.numPlayers(game, matchID.value);
    numPlayers.setPromise(p).catch(setError);
  }

  const joinMatch = (name: string) => {
    const p = LobbyClient.joinMatch(game, matchID.value, name);
    player.setPromise(p)
      .then(p => setStoredPlayer(matchID.value, p))
      .catch(setError);
  }

  if (error) {
    return <div>{`ERROR: ${error.message}`}</div>
  }

  if(matchID.unset) {
    const setNumPlayers = (numPlayers: number) => {
        if(numPlayers === 1) {
          setLocal(true);
          return null; //KLUDGE
        } else {
          const p = LobbyClient.createMatch(game, numPlayers);
          matchID.setPromise(p).then(openMatchPage).catch(setError);
        }
    }
    return <NumPlayers game={game} numPlayers={setNumPlayers} />
  }

  if (matchID.fulfilled && player.unset) {
    return <JoinMatch joinMatch={joinMatch} />;
  }

  if (matchID.fulfilled && player.fulfilled && numPlayers.fulfilled) {
    return <GamePlay.MultiPlayer game={game} matchID={matchID.value} 
      player={player.value} numPlayers={numPlayers.value}/>
  }

  assert(!(matchID.unset && player.unset && numPlayers.unset),
    "Unexpected unset value"); //BUGS

  return <div>Waiting ...</div>;
  }

export { GamePage };
