import React from "react";
import styled from "styled-components";
import { CardSVG } from ".";
import { CardDnD, CardID } from "./card-dnd";

import { Card } from "./types";

type ShowBack = Parameters<typeof CardSVG>[0]["showBack"];

const HandDiv = styled.div`
    display: flex;
`;

export interface HandProps {
    cards: (Card|null)[];
    showBack?: ShowBack;

    /** HandID must be set for the card to be draggable or dropTarget */
    handID?: string;

    dragEnd?: (arg: {from:CardID, to: CardID}) => void;

    /** If set, the cards are drop targets */
    dropTarget?: boolean;
}

export function Hand(props: HandProps): JSX.Element {

    const { cards, showBack, handID, dragEnd, dropTarget } = props;


    const elems = cards.map((card, index) => {
        const key = index; 
        if(!handID) {
            if(dropTarget || dragEnd) {
                console.warn("Drop and/or drop option ignored as card ID was not given");
            }

            return <CardSVG key={key} card={card} showBack={showBack} />;
        }

        const cardID = {handID: handID, index: index};

        return <CardDnD key={key} card={card} showBack={showBack}
            cardID={cardID}
            dragEnd={dragEnd}
            dropTarget={dropTarget}
        />;
    });

    return <HandDiv> {elems} </HandDiv>;
}
