import React, { useCallback } from "react";
import { useCribbageContext } from "../client-side/cribbage-context";
import { CardDnD, CardID } from "../../../utils/cards/card-dnd";
import { CardSetID } from "../client-side/game-state";
import { Card } from "../../../utils/cards/types";
import styled from "styled-components";

const HandDiv = styled.div`
    display: flex;
`;


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

    const dragEnd = useCallback((arg: {from:CardID, to: CardID}) => {
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
       
    return <HandDiv> {elems} </HandDiv>;
}

