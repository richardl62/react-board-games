import React, { useEffect, useState } from 'react';
import assert from '../shared/assert';
import { MatchID, Player, AppGame } from '../shared/types';
import * as GamePlay from './game-play';
import * as LobbyClient from '../shared/bgio';
import { openMatchPage } from './url-params';
import { getStoredPlayer, setStoredPlayer } from './local-storage';

interface StartMatchOptions {
  nPlayers: number;
  offline: boolean;
}
interface GetOptionsAndStartMatchProps {
  game: AppGame;
  startMatch: (arg: StartMatchOptions) => void;
}

function GetOptionsAndStartMatch(
  {
    game : { minPlayers , maxPlayers }, 
    startMatch
  }: GetOptionsAndStartMatchProps
) {

  assert(maxPlayers >= 2); // If only one play is allowed, we should not have got here.
  const defaultNumPlayers = Math.max(minPlayers, 2);

  const [numPlayers, setNumPlayers] = useState<number>(defaultNumPlayers);

  return (<div>
    <label htmlFor='numPlayers'>
      {`Number of players (${minPlayers}-${maxPlayers}):`}
    </label>
    
    <input type="number" name='numPlayers'
      min={minPlayers} max={maxPlayers} 
      value={numPlayers}
      onChange={(event) => setNumPlayers(Number(event.target.value))}
    />
    <button type="button" onClick={() => startMatch({nPlayers: numPlayers, offline: false})}>
      Start Game
    </button>

    <div>
      <br/>
      <span>Test/Debug: </span>
      <button type="button" onClick={() => startMatch({nPlayers: numPlayers, offline: true})}>
        Start Offline
      </button>
    </div>

  </div>);
}

interface SetNameProps {
  buttonText: string;
  setName: (arg: string) => void;
}

function SetName(props: SetNameProps) {
  const setNameCallback = props.setName;
  const buttonText = props.buttonText;

  const [name, setName] = useState<string>('');
  return (
    <div>
      <div>
        <label>Name</label>
        <input value={name} placeholder='Player name' onInput={e => setName(e.currentTarget.value)} />

        <button type="button" onClick={() => setNameCallback(name)}>
          {buttonText}
        </button>

      </div>
    </div>);
}


interface GamePageProps {
  game: AppGame;
  matchID: MatchID | null;
}

function GamePage(props: GamePageProps) {
  interface State {
    game: AppGame;
    waiting: boolean;
    error?: Error;
    local?: boolean;
    matchID?: MatchID | null;
    player?: Player | null;
    numPlayers?: number;
  };
  const game = props.game;

  useEffect(() => {
    document.title = game.displayName
  }, [game.displayName]);

  const [state, setState] = useState<State>({
    game: game,
    waiting: false,
    matchID: props.matchID,
    player: props.matchID && getStoredPlayer(props.matchID),
  });

  const setError = (error: Error) => {
    setState({ ...state, error: error });
  }

  const startMatch = ({nPlayers, offline} : StartMatchOptions) => {
    if (offline) {
      setState({ ...state, local: true });
    } else {
      setState({ ...state, waiting: true });
      LobbyClient.createMatch(game, nPlayers)
        .then(openMatchPage)
        .catch(setError);
    }
  }

  if (state.error) {
    console.log("GamePage error: state=", state);
    return <div>{`ERROR: ${state.error.message}`}</div>
  }

  if (state.waiting) {
    return <div>Waiting ...</div>;
  }

  if (state.local) {
    return <GamePlay.Local game={game} />
  }

  if (!state.matchID) {
    return <GetOptionsAndStartMatch game={game} startMatch={startMatch} />
  }

  if (!state.numPlayers) {
    setState({ ...state, waiting: true });
    LobbyClient.numPlayers(game, state.matchID)
      .then(numPlayers => setState({ ...state, numPlayers: numPlayers, waiting: false }))
      .catch(setError);
    return null;
  }

  if (!state.player) {
    const matchID = state.matchID;
    const setName = (name: string) => {

      setState({ ...state, waiting: true });

      LobbyClient.joinMatch(game, matchID, name)
        .then(player => {
          setStoredPlayer(matchID, player);
          setState({ ...state, player: player, waiting: false });
        })
        .catch(setError);
    }
    return <SetName setName={setName} buttonText={'Join Match'} />;
  }

  return <GamePlay.MultiPlayer game={game} matchID={state.matchID}
    player={state.player} numPlayers={state.numPlayers} />
}

export { GamePage };
