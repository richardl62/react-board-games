import { AppGame } from '@/app-game-support/app-game';
import { defaultPlayerName } from '@/app-game-support/player-status';
import { OptionValues } from '@/option-specification/types';
import { makeMutableMatchData } from '@shared/game-control/make-mutable-match-data';
import { PublicPlayerMetadata } from '@shared/lobby/types';
import { ServerMatchData } from '@shared/server-match-data';
import { RandomAPI } from '@shared/utils/random-api';

export interface OfflineMatchData extends ServerMatchData {
  /** An error reported by the last action (i.e. move or event), or null if there was no
   * reported error. */
  errorInLastAction: string | null;
}

function playerData(playOrder: string[]): PublicPlayerMetadata[] {
  return playOrder.map((id) => ({
    id,
    name: defaultPlayerName(id),
    isConnected: true,
  }));
}

// make a ServerMatchData suitable for the start of an offline match.
// seed must be in [0, 1).
export function makeInitialMatchData(
  game: AppGame,
  numPlayers: number,
  seed: number,
  options: OptionValues,
): OfflineMatchData {
  const random = RandomAPI.fromSeed(seed);
  const mutableData = makeMutableMatchData(game, numPlayers, options, random);
  return {
    ...mutableData,
    playerData: playerData(mutableData.ctxData.playOrder),
    errorInLastAction: null,
  };
}
