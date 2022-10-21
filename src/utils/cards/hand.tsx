import React from "react";
import { CardDnD, getCardID, playingCard } from "./card-dnd";
import { Card } from "./types";
import { Spread } from "./spread";
import { useDrop } from "react-dnd";
import styled from "styled-components";

const OuterDiv = styled.div`
    height: auto;
    width: auto;
`;


interface HandProps {
    cards : (Card|null) [];
    showBack: boolean | ((index: number) => boolean);

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
    onDrop: (
        arg: {
            from: {handID: string, index: number},
            to: {handID: string, index?: number},
        }
    ) => void
}

export function Hand(props: HandProps) : JSX.Element {
    const { cards, cardWidth, cardHeight, maxSeperation,
        handID, draggable, dropTarget, onDrop } = props;

    const showBack = (index: number) : boolean => {
        if(typeof props.showBack === "boolean") {
            return props.showBack;
        }

        return props.showBack(index);
    };

    const [, dropRef] = useDrop(() => ({
        accept: playingCard,
        drop: (draggedID, monitor) => {
            // Ignore recursive drops (i.e. ignore a drop on this hand
            // if drop on a card in the hand has already been reported).
            if (!monitor.didDrop()) {
                onDrop({
                    from: getCardID(draggedID),
                    to: { handID }
                });
            }
        },
    }), [handID]);

    const elems = cards.map((card, index) => {

        return <CardDnD
            key={index}
            card={card}
            showBack={showBack(index)}
         
            cardID={{handID, index}}

            draggable={draggable(index)}
            dropTarget={dropTarget(index)}
            onDrop={onDrop}
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

