import React from "react";
import styled from "styled-components";
import { CardNonJoker, CardSVG } from "../../../utils/cards";
import { cardName } from "../../../utils/cards/types";

const cardOffset = 20;

const OuterDiv = styled.div<{nCards: number}>`
  position: relative;
  border: solid black 1px;
  
  padding-bottom: ${props => (props.nCards-1)*cardOffset}px;
`;

const CardDiv = styled.div<{index: number}>`
    position: absolute;
    top: ${props => props.index*cardOffset}px;
    z-index: ${props => props.index+1};
`;

interface Props {
    cards: CardNonJoker[];
}

export function DiscardPile(props: Props): JSX.Element {
    const { cards } = props;
    return <OuterDiv nCards={cards.length}>
        <CardSVG />
        {cards.map((card, index) =>
            <CardDiv 
                index={cards.length - (index+1)} 
                key={cardName(card) + index}>
                <CardSVG card={cards[index]} />
            </CardDiv>
        )}
    </OuterDiv>;
}
