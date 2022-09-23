import React, { useCallback } from "react";
import { useCribbageContext } from "../client-side/cribbage-context";
import { Hand } from "../../../utils/cards";
import { CardID } from "../../../utils/cards/card-dnd";
import { CardSetID } from "../client-side/game-state";

interface WrappedHandProps {
    cardSetID: CardSetID;
}

export function WrappedHand(props: WrappedHandProps) : JSX.Element {
    const { cardSetID } = props;

    const context = useCribbageContext();
    const { dispatch } = context;
    const cards = context[cardSetID].hand;

    const dragEnd = useCallback((arg: {from:CardID, to: CardID}) => {
        dispatch({
            type: "drag",
            data: arg,
        });

    },[]);
       
    return <Hand cards={cards} handID={cardSetID} dragEnd={dragEnd} dropTarget />;
}

