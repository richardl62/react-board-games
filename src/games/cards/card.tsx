import React from "react";
const suits = ["C","D","H","S"] as const;
const ranks = ["A","1","2","3","4","5","6","7","8","9","10","J","Q","K"] as const;

import * as CardSVGs  from "./card-svgs";


type Suit = typeof suits[number];
type Rank = typeof ranks[number];

export interface Card {
    rank: Rank;
    suit: Suit;
}

// Inefficient if called multiple times (could cache a deck)
export function deck() : Card[] {
    const cards: Card[] = [];
    for(const rank of ranks) {
        for(const suit of suits) {
            cards.push({rank: rank, suit: suit});
        }
    }

    return cards;
}

function imageFile(card: Card) {
    //return `./images/${card.rank}${card.suit}.svg`;
    return "./images/1B.svg";
}

interface CardProps {
    card: Card;
}

export function CardSVG(props: CardProps) : JSX.Element {
    return <CardSVGs.Card1B />;
}