import React from "react";
import { sAssert } from "../../../utils/assert";
import { useCribbageContext } from "../cribbage-context";
import { Hand, OnDrop } from "../../../utils/cards";

export function AddingCardsToBox() : JSX.Element {
    const { me, other, addingCardsToBox, dispatch } = useCribbageContext();
    sAssert(addingCardsToBox);

    const { inBox } = addingCardsToBox;

    const onDrop : OnDrop = arg => {
        const { drag, drop } = arg;

        if(drop && drop.handID === "hand") {
            dispatch({
                type: "dragWithinHand", 
                data: {from: drag.index, to: drop.index},
            });
        }

        if(drop && drop.handID === "dropSpot") {
            dispatch({
                type: "moveToBox", 
                data: {from: drag.index},
            });
        }
    };

    return <div>
        <Hand cards={other.hand} showBack />

        <Hand cards={inBox}
            dropSpot={{psuedoHandId: "dropSpot"}}
        />
       
        <Hand cards={me.hand}
            dragDrop={{
                handID: "hand",
                draggable: true,
                onDrop: onDrop,
            }}
        />
    </div>;

}
