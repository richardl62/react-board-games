import { AppGame } from '@/app-game-support/app-game';
import { defaultPlayerName } from '@/app-game-support/player-status';
import { OptionValues } from '@/option-specification/types';
import { makeActiveMatchState } from '@shared/game-control/make-active-match-data';
import { PublicPlayerMetadata } from '@shared/lobby/types';
import { MatchState } from '@shared/match-state';
import { RandomAPI } from '@shared/utils/random-api';

function playerData(game: AppGame, playOrder: string[]): PublicPlayerMetadata[] {
  return playOrder.map((id) => ({
    id,
    name: defaultPlayerName(id),
    isConnected: true,
    ...(game.setupPlayerData ? { gameData: game.setupPlayerData(id) } : {}),
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
  const matchState = makeActiveMatchState(game, numPlayers, options, random);
  return {
    ...matchState,
    playerData: playerData(game, matchState.ctxData.playOrder),
    errorInLastAction: null,
  };
}
