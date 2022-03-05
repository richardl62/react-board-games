import React from "react";
import { useCribbageContext } from "../cribbage-context";
import { Hand } from "../../../utils/cards";

type DragEnd = Required<Parameters<typeof Hand>[0]>["draggable"]["dragEnd"]
export function AddingCardsToBox() : JSX.Element {
    const { me, other, box, dispatch } = useCribbageContext();


    const dragEnd : DragEnd = arg => {
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
    };

    return <div>
        <Hand cards={other.hand} showBack />

        <Hand cards={box}
            dropSpot={{handId: "dropSpot"}}
        />
       
        <Hand cards={me.hand}
            draggable={{
                handID: "hand",
                dragEnd: dragEnd,
            }}
        />
    </div>;

}
