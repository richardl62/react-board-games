import { PlayerID } from "boardgame.io";
import React from "react";
import styled from "styled-components";
import { CardNonJoker, CardSVG } from "../../../utils/cards";
import { cardName } from "../../../utils/cards/types";
import { CardDraggable } from "./drag-drop";

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
    index: number;
    owner: PlayerID;
}

export function DiscardPile(props: Props): JSX.Element {
    const { cards, owner, index: pileIndex } = props;

    return <OuterDiv nCards={cards.length}>
        {/* KLUDGE: Always having an empty card esures that the outer div
            has the required width
        */}
        <CardSVG />

        {cards.map((card, cardIndex) =>
            <CardDiv 
                index={cards.length - (cardIndex+1)} 
                key={cardName(card) + cardIndex}>
                <CardDraggable
                    owner={owner} 
                    card={cards[cardIndex]} 
                    location={{area:"discardPiles", pileIndex, cardIndex}}
                />
            </CardDiv>
        )}
    </OuterDiv>;
}
