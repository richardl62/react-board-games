import React from "react";
import { CardDnD, playingCard } from "../../../utils/cards/card-dnd";
import { Card } from "../../../utils/cards/types";
import { Spread } from "./spread";
import { useDrop } from "react-dnd";
import styled from "styled-components";

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


    handID: string; 

    draggable: (index: number) => boolean;
    dropTarget: (index?: number) => boolean;

    /** Function to call at end of a drag of a card in this hand.
     * 
     * (Strictly speaking, from.handID is redundant as it will always be the
     * same function to be supplied to multipled.)
     */
    onDragEnd: (
        arg: {
            from: {handID: string, index: number},
            to: {handID: string, index?: number},
        }
    ) => void
}

export function Hand(props: HandProps) : JSX.Element {
    const { cards, cardWidth, cardHeight, maxSeperation,
        handID, draggable, dropTarget, onDragEnd} = props;

    const [, dropRef] = useDrop(() => ({
        accept: playingCard,
        drop: () => {return {handID, index: null};},
    }), [handID]);

    const elems = cards.map((card, index) => {

        return <CardDnD
            key={index}
            card={card}
         
            cardID={{handID, index}}
            dragEnd={dropTarget(index) ? onDragEnd : undefined }
            dropTarget={draggable(index)}
        />;
    });

    const spread = <Spread
        elemHeight={cardHeight}
        elemWidth={cardWidth}
        maxElemSeparation={maxSeperation}
        totalWidth={4 * cardWidth + 3 * maxSeperation}
        elems={elems}
    />;

    if(dropTarget()) {
        return <OuterDiv ref={dropRef}>
            {spread} 
        </OuterDiv>;
    }

    return spread;
}

