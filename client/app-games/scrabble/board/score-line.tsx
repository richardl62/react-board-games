import { blank } from '@game-control/games/scrabble/config/letters';
import { JSX } from 'react';
import { findActiveLetters } from '../client-side/find-active-letters';
import { getWordsAndScore } from '../client-side/get-words-and-score';
import { useScrabbleState } from '../client-side/scrabble-state';

export function ScoreLine(): JSX.Element | null {
  const context = useScrabbleState();

  const active = findActiveLetters(context);
  const wordsAndScore = getWordsAndScore(context, active);

  let illegalWords: string[] = [];
  if (wordsAndScore?.illegalWords) {
    illegalWords = wordsAndScore.illegalWords.filter((word) => !word.includes(blank));
  }

  if (active.length === 0) {
    return null;
  }

  let scoreText = 'Word score: ';
  scoreText += wordsAndScore ? wordsAndScore.score : '-';
  if (illegalWords.length > 0) {
    const pluralise = illegalWords.length > 1 ? 's' : '';
    scoreText += ` (includes illegal word${pluralise}: ${illegalWords.join(', ')})`;
  }

  return <div>{scoreText}</div>;
}
