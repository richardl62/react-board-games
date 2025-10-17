import { Card } from "./types.js";

export function cardName(card: Card) : string {
    const { rank, suit, joker } = card;

    if (rank && suit) {
        return rank+suit;
    }

    return "Joker" + joker;
}

