import { CardNonJoker, ranks, suits } from './types.js';

// Return a deck with or without jokers.
// Inefficient if called multiple times (could cache a deck)
//
// Shuffling is left to client code. This is partly to allow client code
// to use 'random.shuffle' from BGIO where appropriate.
export function deckNoJokers(): CardNonJoker[] {
  const cards: CardNonJoker[] = [];
  for (const rank of ranks) {
    for (const suit of suits) {
      cards.push({ rank: rank, suit: suit });
    }
  }

  return cards;
}
