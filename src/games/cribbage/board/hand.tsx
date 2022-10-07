import React, { useCallback } from "react";
import { useCribbageContext } from "../client-side/cribbage-context";
import { CardDnD, CardDndID } from "../../../utils/cards/card-dnd";
import { CardSetID } from "../client-side/game-state";
import { Card } from "../../../utils/cards/types";
import { cardSize } from "../../../utils/cards/styles";
import { Spread } from "./spread";

interface HandProps {
    cardSetID: CardSetID;
}

export function Hand(props: HandProps) : JSX.Element {
    const { cardSetID } = props;

    const context = useCribbageContext();
    const { dispatch } = context;
    let cards : (Card|null) [] = context[cardSetID].hand;
    if (cards.length === 0) {
        cards = [null];
    }

    const dragEnd = useCallback((arg: {from:CardDndID, to: CardDndID}) => {
        dispatch({
            type: "drag",
            data: arg,
        });

    },[]);

    const elems = cards.map((card, index) => {

        const cardID = {handID: cardSetID, index: index};

        return <CardDnD
            key={index}
            card={card}
            cardID={cardID}
            dragEnd={dragEnd}
            dropTarget
        />;
    });
    
    const cardWidth = cardSize.width;
    const maxSeperation = cardSize.width / 12;
    return <Spread
        elemHeight={cardSize.height}
        elemWidth={cardSize.width}
        maxElemSeparation={maxSeperation}
        totalWidth={4*cardWidth + 3*maxSeperation}
        elems={elems} 
    />;
}

