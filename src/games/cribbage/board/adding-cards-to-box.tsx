import React from "react";
import { sAssert } from "../../../utils/assert";
import { DndProvider } from "../../../utils/board/drag-drop";
import { useCribbageContext } from "../cribbage-context";
import { Hand } from "./hand";

export function AddingCardsToBox() : JSX.Element {
    const { me, other, addingCardsToBox } = useCribbageContext();
    sAssert(addingCardsToBox);

    const { inBox } = addingCardsToBox ;

    return <DndProvider>
        <div>
            <Hand cards={other.hand} showBack />
            <Hand cards={inBox} showBack />
            <Hand cards={me.hand} />
        </div>
    </DndProvider>;

}
