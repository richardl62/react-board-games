import { JSX } from 'react';
import { useCrossTilesContext } from '../client-side/actions/cross-tiles-context';
import { checkGrid } from '../client-side/check-grid/check-grid';
import { Letter } from '@game-control/games/crosstiles/config';
import { displayName } from '@game-control/games/crosstiles/score-categories';
import { ScoreCard } from '@game-control/games/crosstiles/moves/score-card';
import { sAssert } from '@utils/assert';

interface GridStatusProps {
  scoreCard: ScoreCard;
  grid: (Letter | null)[][];
  checkSpelling?: boolean; // Defaaults to true
  noScoreMessage?: () => string;
}
export function GridStatus(props: GridStatusProps): JSX.Element | null {
  const { scoreCard, grid, noScoreMessage } = props;
  const checkSpelling = props.checkSpelling !== false;
  const ctx = useCrossTilesContext();

  let isLegalWord;
  if (checkSpelling) {
    isLegalWord = ctx.isLegalWord;
  } else {
    isLegalWord = () => true;
  }

  const { gridCategory, scoreCategory, illegalWords, nBonuses } = checkGrid(
    grid,
    scoreCard,
    isLegalWord,
  );

  let text: string;
  let nsText: string | null = null;

  if (scoreCategory) {
    sAssert(gridCategory);
    text = displayName[gridCategory];
    if (scoreCategory === 'chance') {
      text += ' (as chance)';
    }

    if (nBonuses === 1) {
      text += ' & bonus';
    }

    if (nBonuses > 1) {
      text += ` + ${nBonuses} bonuses`;
    }
  } else {
    if (illegalWords) {
      text = `Illegal words: ${illegalWords.join(' ')}`;
    } else if (gridCategory) {
      text = `${displayName[gridCategory]} unavailable`;
    } else {
      text = 'No category completed';
    }

    if (noScoreMessage) {
      nsText = noScoreMessage();
    }
  }

  return (
    <div>
      <div>{text}</div>
      {nsText && <div>{nsText}</div>}
    </div>
  );
}
