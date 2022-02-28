import React from "react";
import { sAssert } from "../../../utils/assert";
import { DndProvider } from "../../../utils/board/drag-drop";
import { useCribbageContext } from "../cribbage-context";
import { Hand, OnDrop } from "../../../utils/cards/hand";

export function AddingCardsToBox() : JSX.Element {
    const { me, other, addingCardsToBox } = useCribbageContext();
    sAssert(addingCardsToBox);

    const { inBox } = addingCardsToBox;

    const onDrop : OnDrop = arg => console.log("drag", arg.drag, "drop", arg.drop);

    return <DndProvider>
        <div>
            <Hand cards={other.hand} showBack />

            <Hand cards={inBox} showBack 
                dragDrop={{
                    handID: "box",
                    onDrop: onDrop,
                }}
            />

            <Hand cards={me.hand}
                dragDrop={{
                    handID: "hand",
                    draggable: true,
                }}
            />
        </div>
    </DndProvider>;

}
