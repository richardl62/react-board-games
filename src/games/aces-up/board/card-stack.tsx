import React from "react";
import styled from "styled-components";
import { CardNonJoker, CardSVG } from "../../../utils/cards";
import { cardSize, cardVerticalStackingOffset } from "../../../utils/cards/styles";
import { CardID } from "../game-control/card-id";
import { useCardDragRef, useCardDropRef } from "./drag-drop";


const SubStackDiv = styled.div`
    position: absolute;

    /* KLUDGE?: Set top on all but the first of the nested divs */
    > div {
        top: ${cardVerticalStackingOffset}px;
    }
`;

function SubStack(props: {
    cards: CardNonJoker[],
    cardIndex: number,
    dragID: (index: number) => CardID;
}) {
    const {cards, cardIndex, dragID } = props;

    const dragRef = useCardDragRef(dragID(cardIndex));

    return <SubStackDiv ref={dragRef}>
        <CardSVG card={cards[cardIndex]} />
        {cardIndex < cards.length - 1 &&
            <SubStack cards={cards} cardIndex={cardIndex+1} dragID={dragID} />
        }

    </SubStackDiv>;
}

function stackHeight(nCards: number) {
    if(nCards === 0) {
        return cardSize.height;
    } else {
        return cardSize.height + (nCards-1) * cardVerticalStackingOffset;
    }
}

const CardStackDiv = styled.div<{height: number}>`
    position: relative;

    /* Contained divs uses absolute position and so do not set size  */
    height: ${props => props.height}px;
    width: ${cardSize.width}px;
`;

/** Show cards stacked vertically.  Low index cards are highest in terms of screen position,
 * but lowest in terms of z-index (so low index cards are partially hidden by low index cards).
 */
export function CardStack(props: {
    cards: CardNonJoker[];
    dragID: (index: number) => CardID;
    dropID: CardID;

}): JSX.Element {
    const { cards, dragID, dropID } = props;

    const dropRef = useCardDropRef(dropID);

    return <CardStackDiv ref={dropRef} height={stackHeight(cards.length)}>
        {cards.length === 0 ? 
            <CardSVG /> : 
            <SubStack cards={cards} cardIndex={0} dragID={dragID} />
        }
    </CardStackDiv>;
}
