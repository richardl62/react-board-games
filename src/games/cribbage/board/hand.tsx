import React, { useCallback } from "react";
import { useCribbageContext } from "../client-side/cribbage-context";
import { CardDnD, CardDndID, playingCard } from "../../../utils/cards/card-dnd";
import { CardSetID } from "../server-side/server-data";
import { Card } from "../../../utils/cards/types";
import { Spread } from "./spread";
import { useDrop } from "react-dnd";
import styled from "styled-components";
import { dragAllowed, dropTarget } from "../client-side/dnd-control";

const OuterDiv = styled.div`
    height: auto;
    width: auto;

    background: cornsilk;
`;
interface HandProps {
    cards : (Card|null) [];

    cardWidth: number;
    cardHeight: number;
    maxSeperation: number;

    cardSetID: CardSetID;
}

export function Hand(props: HandProps) : JSX.Element {
    const { cards, cardSetID, cardWidth, cardHeight, maxSeperation } = props;

    const context = useCribbageContext();
    const { moves } = context;


    const dragEnd = useCallback((arg: {from:CardDndID, to: CardDndID}) => {
        moves.drag(arg);
    },[]);

    const handID: CardDndID = {handID: cardSetID, index: null};
    const [, dropRef] = useDrop(() => ({
        accept: playingCard,
        drop: () => handID,
    }), [cardSetID]);

    const elems = cards.map((card, index) => {

        const cardID = {handID: cardSetID, index: index};

        return <CardDnD
            key={index}
            card={card}
            cardID={cardID}
            dragEnd={dragAllowed(context, cardID) ? dragEnd : undefined }
            dropTarget={dropTarget(context, cardID)}
        />;
    });
    
    const spread = <Spread
        elemHeight={cardHeight}
        elemWidth={cardWidth}
        maxElemSeparation={maxSeperation}
        totalWidth={4 * cardWidth + 3 * maxSeperation}
        elems={elems}
    />;

    if(dropTarget(context, handID)) {
        return <OuterDiv ref={dropRef}>
            {spread} 
        </OuterDiv>;
    }

    return spread;
}

