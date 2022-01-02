import React from "react";
import { getCardComponent } from "./card-components";
const suits = ["C","D","H","S"] as const;
const ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"] as const;


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

export function cardName(card: Card) : string {
    const { rank, suit, joker } = card;

    if (rank && suit) {
        return rank+suit;
    }

    return "Joker" + joker;
}

// Inefficient if called multiple times (could cache a deck)
export function deck(options: {jokers: boolean}) : Card[] {
    const cards: Card[] = [];
    for(const rank of ranks) {
        for(const suit of suits) {
            cards.push({rank: rank, suit: suit});
        }
    }

    if (options.jokers) {
        cards.push({joker: 1});
        cards.push({joker: 2});
    }

    return cards;
}

interface CardProps {
    card: Card;
}

export function CardSVG(props: CardProps) : JSX.Element {
    const { card } = props;

    const CardComponent = getCardComponent(card);
    if(CardComponent) {
        return <CardComponent />;
    }

    return <div>{`Unknown card: ${card.rank}${card.suit}`}</div>;
}