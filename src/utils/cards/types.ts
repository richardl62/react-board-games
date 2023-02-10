import { sAssert } from "../assert";

export const suits = ["C","D","H","S"] as const;
export const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"] as const;

export type Suit = typeof suits[number];
export type Rank = typeof ranks[number];

export interface CardNonJoker {
    rank: Rank;
    suit: Suit;
    joker?: undefined;
}

interface CardJoker {
    rank?: undefined;
    suit?: undefined;
    joker: 1 | 2;
}

export type Card = CardJoker | CardNonJoker;

export function compareCards(c1: Card, c2: Card) : number {
    if(c1.rank && c2.rank) {
        return c1.rank.localeCompare(c2.rank)
            || c1.suit.localeCompare(c2.suit);
    }

    if(c1.joker && c2.joker) {
        return c1.joker - c2.joker;
    }

    return c1.joker ? 1 : -1;
}

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

export function rankName(rank: Rank) : string {
    if(rank === "A") {
        return "ace";
    }

    if(rank === "J") {
        return "Jack";
    }

    if(rank === "Q") {
        return "queen";
    }

    if(rank === "K") {
        return "king";
    }

    return rank;

    sAssert(false);
}

export function cardName(card: Card) : string {
    if(card.joker) {
        return "joker" + card.joker;
    }

    return card.rank + suitName(card.suit);
}

export type CardBack = "red" | "black";


