import React, { useState } from 'react';
import { MatchID, Player, AppGame } from '../shared/types';
import { GamePlay } from './game-play';
import * as LobbyClient  from '../shared/bgio';
import { openMatchPage } from './url-params';
import { getStoredPlayer, setStoredPlayer } from './local-storage';
import { useStatePromise } from '../shared/tools';
import assert from 'assert';

interface StartMatchProps {
  game: AppGame;
  startMatch: (numPlayers: number) => void;
}

function StartMatch({game, startMatch} : StartMatchProps) {
  const [ numPlayers, setNumPlayers ] = useState<number>(game.minPlayers);
  const { minPlayers, maxPlayers } = game;

  if (minPlayers === maxPlayers) {
    startMatch(minPlayers);
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
    <button type="button" onClick={()=>startMatch(numPlayers)}>Start Game</button>

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
    
  const { game } = props;    
  const [error, setError] = useState<Error | null>(null);
  const player = useStatePromise<Player>();
  const numPlayers = useStatePromise<number>();
  const matchID = useStatePromise<MatchID>(props.matchID);

  if(game.minPlayers) {
    return <GamePlay game={game} local={true} />
  }


  const storedPlayer = matchID.fulfilled && getStoredPlayer(matchID.value);
  
  if(storedPlayer && player.unset) {
    player.value = storedPlayer;
  }

  if(matchID.fulfilled && numPlayers.unset) {
    const p = LobbyClient.numPlayers(game, matchID.value);
    numPlayers.setPromise(p).catch(setError);
  }

  const startMatch = (numPlayers: number) => {
    const p = LobbyClient.createMatch(game, numPlayers);
    matchID.setPromise(p).then(openMatchPage).catch(setError);
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
    return <StartMatch game={game} startMatch={startMatch} />
  }

  if (matchID.fulfilled && player.unset) {
    return <JoinMatch joinMatch={joinMatch} />;
  }

  if (matchID.fulfilled && player.fulfilled && numPlayers.fulfilled) {
    return <GamePlay game={game} matchID={matchID.value} player={player.value} numPlayers={numPlayers.value}/>
  }

  assert(!(matchID.unset && player.unset && numPlayers.unset),
    "Unexpected unset value"); //BUGS

  return <div>Waiting ...</div>;
  }

export { GamePage };
