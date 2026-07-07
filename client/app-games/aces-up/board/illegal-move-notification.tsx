import { sAssert } from '@utils/assert';
import { compareRank, rankName } from '@utils/cards/types';
import { removeDuplicates } from '@utils/remove-duplicated';
import { cardsMovableToSharedPile } from '@game-control/games/aces-up/moves/cards-movable-to-shared-pile';
import { PlayerInfo } from './player-info';
import { MatchState } from '../game-support/match-state';

export function illegalMoveNotication(
  matchState: Pick<MatchState, 'G' | 'getPlayerData'>,
  playerInfo: PlayerInfo,
): string | null {
  const { G } = matchState;
  if (G.moveToSharedPile !== 'omitted') {
    // No notification needed
    return null;
  }

  if (playerInfo.owner !== playerInfo.viewer) {
    return null;
  }

  if (playerInfo.owner !== playerInfo.currentPlayer) {
    return null;
  }

  const moveableRanks = () => {
    const movableCards = cardsMovableToSharedPile(matchState, playerInfo.currentPlayer);
    sAssert(movableCards.length > 0, 'Illegal move warning, but no movable cards found');

    const ranks = movableCards.map((card) => card.rank).sort(compareRank);

    return removeDuplicates(ranks).map(rankName);
  };

  return (
    'You must move card to a shared pile' + ` (Your movable ranks: ${moveableRanks().join(', ')})`
  );
}
