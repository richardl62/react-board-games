import { PlayerID } from "boardgame.io";
import React from "react";
import styled from "styled-components";
import { CardNonJoker, CardSVG } from "../../../utils/cards";
import { cardSize, cardVerticalStackingOffset } from "../../../utils/cards/styles";
import { cardName } from "../../../utils/cards/types";
import { CardID } from "../game-control/card-id";
import { useCardDragRef, useCardDropRef } from "./drag-drop";

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

const CardAreaDiv = styled.div<{
    cardsAbove: number,
    cardsBelow: number,
}>`
    /* KLUDGE?: Rely on order of cards to get the required overlapping.
      (The same overlap can achieved by setting z-index to cardsAbove, but then 
      only the selected card would apoear to drag, not the cards below it. 
      Limitation: With Firefox only the selected card appears to drag wether
      or not the z-index is set.)*/
    position: absolute;
    top: ${props => cardTop(props.cardsAbove)}px;

    height: ${props => pileHeight(props.cardsBelow)}px;
`;

function CardArea(props:{
    cards: CardNonJoker[],
    cardIndex: number,
    cardID: CardID,
}) {
    const { cards, cardIndex, cardID } = props;
    const dragRef = useCardDragRef(cardID);

    // Card with index 0 is at the top
    const cardsAbove = cardIndex;
    const cardsBelow = cards.length - (cardIndex + 1);

    return <CardAreaDiv ref={dragRef} cardsAbove={cardsAbove} cardsBelow={cardsBelow}>
        <CardSVG card={cards[cardIndex]} />
    </CardAreaDiv>;
}

export function DiscardPile(props: {
    cards: CardNonJoker[];
    index: number;
    owner: PlayerID;
}): JSX.Element {
    const { cards, owner, index: pileIndex } = props;

    const dropRef = useCardDropRef({area: "discardPileAll", pileIndex, owner});
    
    const cardDivs : JSX.Element[] = [];

    /* KLUDGE?: Backwards loop to achieve desired overlap - see CardDiv */
    for(let cardIndex = 0; cardIndex < cards.length; ++cardIndex) {
        const cardID : CardID = { area: "discardPileCard", pileIndex, cardIndex: cardIndex, owner };
        const key= cardName(cards[cardIndex]) + cardIndex;

        cardDivs.push(
            <CardArea key={key} cards={cards} cardIndex={cardIndex} cardID={cardID} />
        );
    }

    return <OuterDiv ref={dropRef} nCards={cards.length}>
        {cardDivs.length === 0 && <CardSVG />}
        {cardDivs}
    </OuterDiv>;
}
