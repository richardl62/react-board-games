import { AppGame } from '@/app-game-support/app-game';
import { MatchID } from '@/app-game-support/types';
import { useSearchParamData } from '@/url-tools';
import { LoadingOrError } from '@utils/async-status';
import { JSX } from 'react';
import { useAsyncCallback } from 'react-async-hook';
import { lobbyClient } from './lobby-client';

interface RestartGameProps {
  game: AppGame;
  matchID: MatchID;
}

/** Button to restart an existing match. Players (including their credentials) are unchanged. */
export function RestartGame(props: RestartGameProps): JSX.Element {
  const { game, matchID } = props;
  const { seed: seedParam } = useSearchParamData();

  const asyncRestartMatch = useAsyncCallback(() =>
    lobbyClient.restartMatch({
      gameName: game.name,
      matchID: matchID.mid,
      // As for a new match, use a fresh seed unless one has been explicitly set.
      randomSeed: seedParam ?? Math.random(),
    }),
  );

  const doRestart = () => {
    if (window.confirm('Restart this game?')) {
      void asyncRestartMatch.execute();
    }
  };

  return (
    <div>
      <button onClick={doRestart}>Restart Game</button>
      <LoadingOrError status={asyncRestartMatch} activity="restarting game" />
      {asyncRestartMatch.status === 'success' && <span>Game has been restarted</span>}
    </div>
  );
}
