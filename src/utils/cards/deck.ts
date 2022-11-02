import { Card, ranks, suits } from "./types";

// Return a deck with optional jokers.
// Inefficient if called multiple times (could cache a deck)
//
// Shuffling is left to client code. This is partly to allow client code 
// to use 'random.shuffle' from BGIO where appropriate.
export function deck( options: { jokers: boolean}): Card[] {
    const cards: Card[] = [];
    for (const rank of ranks) {
        for (const suit of suits) {
            cards.push({ rank: rank, suit: suit });
        }
    }

    if (options.jokers) {
        cards.push({ joker: 1 });
        cards.push({ joker: 2 });
    }

    return cards;
}
