import React from "react";
import styled from "styled-components";
import { deck, CardSVG, cardName } from "./card";

const CardDisplay = styled.div`
    display: grid;

    grid-template-columns: repeat(4, auto);


    > * {
        padding: 2px;
    }
`;

export function CardGame() : JSX.Element {
    const cards = deck({jokers:true});

    return <CardDisplay>
        {cards.map(card => <CardSVG key={cardName(card)} card={card}/>)}
    </CardDisplay>;
}