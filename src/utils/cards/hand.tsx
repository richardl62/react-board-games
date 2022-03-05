import React from "react";
import styled from "styled-components";
import { CardSVG } from ".";
import { CardDnD, CardID } from "./card-dnd";

import { Card } from "./types";

type ShowBack = Parameters<typeof CardSVG>[0]["showBack"];

const HandDiv = styled.div`
    display: flex;
`;

export const dropSpotIndex = -1;

export interface HandProps {
    cards: (Card|null)[];
    showBack?: ShowBack;

    /** If set, the cards are draggable */
    draggable?: {
        handID: string;
        dragEnd: (arg: {from:CardID, to: CardID}) => void;
    };

    /** If set, the cards are drop targets */
    droppable?: {handID: string};

    /** If set, a 'drop spot' is added at the end of the hand.
        This is an empty card which is a drop tanget with the given
        handID and an index of dropSpotIndex. 
    */
    dropSpot?: {handId: string}
}

export function Hand(props: HandProps): JSX.Element {

    const { cards, showBack, draggable, droppable, dropSpot } = props;

    const makeDragEnd = (index: number) => {
        if(draggable) {
            const {handID, dragEnd} = draggable;

            const thisID : CardID = {handID: handID, index: index};

            return (dropID: CardID) => dragEnd({from: thisID, to: dropID});
        }
    };

    const makeDropID = (index: number) => {
        if( droppable ) {
            const {handID} = droppable;

            return {handID: handID, index: index};
        }
    };

    const elems = cards.map((card, index) => {
        const key = index; 
        return <CardDnD key={key} card={card} showBack={showBack}
            dragEnd={makeDragEnd(index)}
            dropID={makeDropID(index)}
        />;
    });
    
    if (dropSpot) {
        const id: CardID = {
            handID: dropSpot.handId,
            index: dropSpotIndex,
        };

        elems.push(
            <CardDnD key={"dropSpot"} card={null} dropID={id} />
        );
    }

    return <HandDiv> {elems} </HandDiv>;
}
