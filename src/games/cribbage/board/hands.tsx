import React, { useCallback } from "react";
import { useCribbageContext } from "../client-side/cribbage-context";
import { Hand } from "../../../utils/cards";
import styled from "styled-components";
import { CardID } from "../../../utils/cards/card-dnd";

const InlineFlex = styled.div`
    display: inline-flex;
`;


export function MyCards() : JSX.Element {
    const { me, dispatch } = useCribbageContext();

    const dragEnd = useCallback((arg: {from:CardID, to: CardID}) => {
        const { from, to } = arg;

        if(to.handID === "hand") {
            dispatch({
                type: "dragWithinHand", 
                data: {from: from.index, to: to.index},
            });
        }

        if(to.handID === "dropSpot") {
            dispatch({
                type: "moveToBox", 
                data: {from: from.index},
            });
        }
    },[]);
       
    return <Hand cards={me.hand} handID={"hand"} dragEnd={dragEnd} dropTarget />;
}

export function PonesCards() : JSX.Element {
    const { pone } = useCribbageContext();
    return <Hand cards={pone.hand} showBack />;
}

export function SharedCards() : JSX.Element {
    const { box } = useCribbageContext();

    return <InlineFlex>
        <Hand cards={box} />
        <Hand cards={[null]} handID={"dropSpot"} dropTarget />
    </InlineFlex>;
}
