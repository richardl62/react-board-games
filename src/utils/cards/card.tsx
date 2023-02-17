import React from "react";
import styled from "styled-components";
import { getCardBackComponent, getCardComponent } from "./card-components";
import { cardSize, defaultCardBack } from "./styles";
import { Card, CardBack } from "./types";

export const EmptyCard = styled.div`
    width: ${cardSize.width}px;  
    height: ${cardSize.height}px;    

    box-sizing: border-box;
    background-color: white;
    border: 1px solid black;
    border-radius: 5%;
`;

type CardProps = {
    card?: Card | null;
    showBack?: boolean | CardBack ;
} 

/**
 *  parameters
 * - card (optional)
 * - showBack (optional) 
 * 
 * If both card and showBack are supplied the card back is shown.
 * If neither is supplied an image of an 'empty' card is shown.
 */
export function CardSVG(props: CardProps): JSX.Element {
    const { card, showBack } = props;

    let Component;
    if (showBack) {
        const cardBack = showBack === true ? defaultCardBack : showBack;
        Component = getCardBackComponent(cardBack);
        return <Component {...cardSize} />;
    } else if (card) {
        Component = getCardComponent(card);
        return <Component {...cardSize} />;
    } else {
        return <EmptyCard />;
    }


}
