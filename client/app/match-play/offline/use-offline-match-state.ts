import { AppGame } from '@/app-game-support/app-game';
import { useSearchParamData } from '@/url-tools';
import { MatchState } from '@shared/match-state';
import { sAssert } from '@shared/utils/assert';
import { WsRematchRequest } from '@shared/ws-rematch-request';
import { useState } from 'react';
import { OfflineOptions } from '../../offline-options';
import { applyRematchRequest } from './apply-rematch-request';
import { makeInitialMatchState } from './make-initial-match-data';

// The state of an offline match, together with functions to restart the match and
// to process rematch requests (as the server does for online matches).
export function useOfflineMatchState(
  game: AppGame,
  { numPlayers, setupData }: OfflineOptions,
): {
  matchState: MatchState;
  setMatchState: (matchState: MatchState) => void;

  // Restart immediately, as for a new match.
  restart: () => void;

  sendRematchRequest: (playerID: string, request: WsRematchRequest) => void;
} {
  const { seed: seedParam } = useSearchParamData();

  const initialMatchState = (seed: number) =>
    makeInitialMatchState(game, numPlayers, seed, setupData);

  const [matchState, setMatchState] = useState(() => initialMatchState(seedParam ?? Math.random()));
  const [rematchSeed, setRematchSeed] = useState<number | null>(null);

  const restartWithSeed = (seed: number) => {
    setMatchState(initialMatchState(seed));
    setRematchSeed(null);
  };

  // As for a new match, use a fresh seed unless one has been explicitly set.
  const restart = () => restartWithSeed(seedParam ?? Math.random());

  const sendRematchRequest = (playerID: string, request: WsRematchRequest) => {
    const result = applyRematchRequest(
      { playerData: matchState.playerData, rematchSeed },
      playerID,
      request,
    );
    if (result.restart) {
      sAssert(result.rematchSeed !== null, 'Rematch seed expected when restarting');
      restartWithSeed(result.rematchSeed);
    } else {
      setMatchState({ ...matchState, playerData: result.playerData });
      setRematchSeed(result.rematchSeed);
    }
  };

  return { matchState, setMatchState, restart, sendRematchRequest };
}
