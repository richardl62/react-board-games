import { sAssert } from "../assert";

export const suits = ["C","D","H","S"] as const;
export const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"] as const;

type Suit = typeof suits[number];
type Rank = typeof ranks[number];

interface NonJoker {
    rank: Rank;
    suit: Suit;
    joker?: undefined;
}

interface Joker {
    rank?: undefined;
    suit?: undefined;
    joker: 1 | 2;
}

export type Card = Joker | NonJoker;

export function suitName(suit: Suit) : string {
    if(suit === "C") {
        return "clubs";
    }

    if(suit === "D") {
        return "diamonds";
    }

    if(suit === "H") {
        return "hearts";
    }

    if(suit === "S") {
        return "spades";
    }

    sAssert(false);
}

export function cardName(card: Card) : string {
    if(card.joker) {
        return "joker" + card.joker;
    }

    return card.rank + suitName(card.suit);
}

export type CardBack = "red" | "black";


