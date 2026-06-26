import { AppGame } from '@/app-game-support/app-game';
import { defaultPlayerName } from '@/app-game-support/player-status';
import { OptionValues } from '@/option-specification/types';
import { makeActiveMatchState } from '@shared/game-control/make-active-match-data';
import { PublicPlayerMetadata } from '@shared/lobby/types';
import { MatchState } from '@shared/match-state';
import { RandomAPI } from '@shared/utils/random-api';

function buildPlayerData(
  playOrder: string[],
  setupPlayerData: Record<string, unknown> | undefined,
): PublicPlayerMetadata[] {
  return playOrder.map((id) => ({
    id,
    name: defaultPlayerName(id),
    isConnected: true,
    ...(setupPlayerData?.[id] !== undefined ? { gameData: setupPlayerData[id] } : {}),
  }));
}

// make a MatchState suitable for the start of an offline match.
// seed must be in [0, 1).
export function makeInitialMatchState(
  game: AppGame,
  numPlayers: number,
  seed: number,
  options: OptionValues,
): MatchState {
  const random = RandomAPI.fromSeed(seed);
  const { playerData: setupPlayerData, ...activeMatchState } = makeActiveMatchState(
    game,
    numPlayers,
    options,
    random,
  );
  return {
    ...activeMatchState,
    playerData: buildPlayerData(activeMatchState.ctxData.playOrder, setupPlayerData),
    errorInLastAction: null,
  };
}
