import { PlayerID } from "boardgame.io";
import React from "react";
import styled from "styled-components";
import { CardNonJoker, CardSVG } from "../../../utils/cards";
import { cardSize, cardVerticalStackingOffset } from "../../../utils/cards/styles";
import { cardName } from "../../../utils/cards/types";
import { CardDraggable, useCardDropRef } from "./drag-drop";

function cardTop(index: number) {
    return index * cardVerticalStackingOffset;
}

function pileHeight(nCards: number) {
    if(nCards === 0) {
        return cardSize.height;
    } else {
        return cardSize.height + cardTop(nCards-1);
    }
}

const OuterDiv = styled.div<{nCards: number}>`
    position: relative;

    height: ${props => pileHeight(props.nCards)}px;
    width: ${cardSize.width}px;
`;

const CardDiv = styled.div<{index: number}>`
    position: absolute;
    top: ${props => cardTop(props.index)}px;
    
    z-index: ${props => props.index+1};

    padding: none;
    margin: none;
`;

interface Props {
    cards: CardNonJoker[];
    index: number;
    owner: PlayerID;
}

export function DiscardPile(props: Props): JSX.Element {
    const { cards, owner, index: pileIndex } = props;

    const dropRef = useCardDropRef({area: "discardPileAll", pileIndex, owner});
    
    const cardDivs = cards.map((card, cardIndex) =>
        <CardDiv
            index={cards.length - (cardIndex + 1)}
            key={cardName(card) + cardIndex}>
            <CardDraggable
                card={cards[cardIndex]}
                id={{ area: "discardPileCard", pileIndex, cardIndex, owner }}
            />
        </CardDiv>
    );

    return <OuterDiv ref={dropRef} nCards={cards.length}>
        {cardDivs.length === 0 && <CardSVG />}
        {cardDivs}
    </OuterDiv>;
}
