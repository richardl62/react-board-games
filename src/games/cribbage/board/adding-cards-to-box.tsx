import React from "react";
import { useCribbageContext } from "../cribbage-context";
import { Hand, OnDrop } from "../../../utils/cards";

export function AddingCardsToBox() : JSX.Element {
    const { me, other, box, dispatch } = useCribbageContext();


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

        <Hand cards={box}
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
