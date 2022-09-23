import React, { useCallback } from "react";
import { useCribbageContext } from "../client-side/cribbage-context";
import { Card, Hand } from "../../../utils/cards";
import { CardID } from "../../../utils/cards/card-dnd";
import { CardSetID } from "../client-side/game-state";

interface WrappedHandProps {
    cardSetID: CardSetID;
}

export function WrappedHand(props: WrappedHandProps) : JSX.Element {
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
       
    return <Hand cards={cards} handID={cardSetID} dragEnd={dragEnd} dropTarget />;
}

