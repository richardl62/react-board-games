import { Card } from "./types";

export function cardName(card: Card) : string {
    const { rank, suit, joker } = card;

    if (rank && suit) {
        return rank+suit;
    }

    return "Joker" + joker;
}

