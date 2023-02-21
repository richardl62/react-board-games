import { PlayerID } from "boardgame.io";
import React from "react";
import styled from "styled-components";
import { CardNonJoker, CardSVG } from "../../../utils/cards";
import { cardSize, cardVerticalStackingOffset } from "../../../utils/cards/styles";
import { useCardDragRef, useCardDropRef } from "./drag-drop";


const SubPileDiv = styled.div`
    position: absolute;

    /* KLUDGE?: Set top on all but the first of the nested divs */
    > div {
        top: ${cardVerticalStackingOffset}px;
    }
`;

function SubPile(props: {
    cards: CardNonJoker[],
    cardIndex: number,
    pileIndex: number,
    owner: PlayerID,
}) {
    const {cards, cardIndex, pileIndex, owner } = props;

    const dragRef = useCardDragRef({area: "discardPileCard", pileIndex, cardIndex, owner});

    return <SubPileDiv ref={dragRef}>
        <CardSVG card={cards[cardIndex]} />
        {cardIndex < cards.length - 1 &&
            <SubPile cards={cards} cardIndex={cardIndex+1} pileIndex={pileIndex} owner={owner} />
        }

    </SubPileDiv>;
}

function pileHeight(nCards: number) {
    if(nCards === 0) {
        return cardSize.height;
    } else {
        return cardSize.height + (nCards-1) * cardVerticalStackingOffset;
    }
}

const DiscardPileDiv = styled.div<{height: number}>`
    position: relative;

    /* SubPile uses absolute position and so does not set size  */
    height: ${props => props.height}px;
    width: ${cardSize.width}px;
`;

export function DiscardPile(props: {
    cards: CardNonJoker[];
    index: number;
    owner: PlayerID; 
}): JSX.Element {
    const { cards, owner, index: pileIndex } = props;

    const dropRef = useCardDropRef({area: "discardPileAll", pileIndex, owner});

    return <DiscardPileDiv ref={dropRef} height={pileHeight(cards.length)}>
        {cards.length === 0 ? 
            <CardSVG /> : 
            <SubPile cards={cards} cardIndex={0} pileIndex={pileIndex} owner={owner} />
        }
    </DiscardPileDiv>;
}
