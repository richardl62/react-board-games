import React, { useState } from 'react';
import { MatchID, Player, AppGame } from '../shared/types';
import * as GamePlay from './game-play';
import * as LobbyClient from '../shared/bgio';
import { openMatchPage } from './url-params';
import { getStoredPlayer, setStoredPlayer } from './local-storage';
import { StartMatchOptions, StartMatchParams } from './start-match-options';

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

interface State {
  matchID: MatchID | null;

  local: boolean;
  player: Player | null;
  numPlayers: number | null;
};


interface GamePageProps {
  game: AppGame;
  matchID: MatchID | null;
}

function GamePage(props: GamePageProps) {

  const game = props.game;

  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<Error|null>(null);

  const [state, setState] = useState<State>({
    matchID: props.matchID,

    local: false,
    numPlayers: null,

    player: props.matchID && getStoredPlayer(props.matchID),
  });


  const startMatch = ({nPlayers, offline} : StartMatchParams) => {
    if (offline) {
      setState({ ...state, numPlayers:nPlayers, local: true });
    } else {
      setWaiting(true);
      LobbyClient.createMatch(game, nPlayers)
        .then(openMatchPage)
        .catch(setError);
    }
  }

  if (error) {
    return <div>{`ERROR: ${error.message}`}</div>
  }

  if (waiting) {
    return <div>Waiting for server ...</div>;
  }

  if (state.local) {
    return <GamePlay.Local game={game} numPlayers={state.numPlayers!} />
  }

  if (!state.matchID) {
    return <StartMatchOptions game={game} setOptions={startMatch} />
  }

  if (!state.numPlayers) {
    setWaiting(true);
    LobbyClient.numPlayers(game, state.matchID)
      .then(numPlayers => {
          setState({ ...state, numPlayers: numPlayers});
          setWaiting(false);
      })
      .catch(setError);
    return null;
  }

  if (!state.player) {
    const matchID = state.matchID;
    const setName = (name: string) => {

      setWaiting(true);

      LobbyClient.joinMatch(game, matchID, name)
        .then(player => {
          setStoredPlayer(matchID, player);
          setState({ ...state, player: player});
          setWaiting(false);
        })
        .catch(setError);
    }
    return <SetName setName={setName} buttonText={'Join Match'} />;
  }

  return <GamePlay.MultiPlayer game={game} matchID={state.matchID}
    player={state.player} numPlayers={state.numPlayers} />
}

export { GamePage };
