import React from "react";
import styled from "styled-components";
import { deck, CardSVG, Card } from "./card";

const CardDisplay = styled.div`
    display: flex;
    flex-wrap: wrap;

    > * {
        padding: 2px;
    }
`;

export function CardGame() : JSX.Element {
    const cards = deck();
    const key = (card: Card) => card.rank+card.suit;
    return <CardDisplay>
        {cards.map(card => <CardSVG key={key(card)} card={card}/>)}
    </CardDisplay>;
}