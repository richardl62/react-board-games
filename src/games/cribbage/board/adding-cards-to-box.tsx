import React, { useCallback } from "react";
import { useCribbageContext } from "../cribbage-context";
import { Hand } from "../../../utils/cards";
import styled from "styled-components";
import { CardID } from "../../../utils/cards/card-dnd";

const InlineFlex = styled.div`
    display: inline-flex;
`;


export function AddingCardsToBox() : JSX.Element {
    const { me, other, box, dispatch } = useCribbageContext();


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

    return <div>
        <Hand cards={other.hand} showBack />


        <InlineFlex>
            <Hand cards={box} />
            <Hand cards={[null]} handID={"dropSpot"} dropTarget />
        </InlineFlex>
       
        <Hand cards={me.hand} handID={"hand"} dragEnd={dragEnd} dropTarget />

    </div>;

}
