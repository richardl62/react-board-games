import { Card, ranks, suits } from "./types";

export function cardName(card: Card) : string {
    const { rank, suit, joker } = card;

    if (rank && suit) {
        return rank+suit;
    }

    return "Joker" + joker;
}

// Inefficient if called multiple times (could cache a deck)
export function deck(options: { jokers: boolean; }): Card[] {
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
