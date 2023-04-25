import { sAssert } from "../assert";

export const suits = ["C","D","H","S"] as const;
export const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"] as const;

export type Suit = typeof suits[number];
export type Rank = typeof ranks[number];

export interface CardNonJoker {
    rank: Rank;
    suit: Suit;
}

interface CardNonJokerExtended extends CardNonJoker {
    joker?: undefined;
}

interface CardJoker {
    rank?: undefined;
    suit?: undefined;
    joker: 1 | 2;
}

export type Card = CardJoker | CardNonJokerExtended;

/**
 * @param rank - Input rank of null to indicate 'below the first rank'.
 * @returns The next rank (aces low) or null if there is no next rank.
 * If passed null, returns 'A' which is the first rank.
 */
export function nextRank(rank: Rank | null) : Rank | null {
    if(rank === null) {
        return "A";
    }

    const newRank = ranks[ranks.indexOf(rank)+1];
    return newRank || null;
}

export function compareRank(r1: Rank, r2: Rank) : number {
    const ind1 = ranks.indexOf(r1);
    const ind2 = ranks.indexOf(r2);

    return ind1 - ind2;
}

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
}

export function cardName(card: Card) : string {
    if(card.joker) {
        return "Joker" + card.joker;
    }

    return card.rank + suitName(card.suit);
}

export function cardShortName(card: Card) : string {
    if(card.joker) {
        return "J" + card.joker;
    }

    return card.rank + card.suit;
}

export type CardBack = "red" | "black";


