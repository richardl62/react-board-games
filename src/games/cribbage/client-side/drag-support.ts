import { sAssert } from "../../../utils/assert";
import { Card } from "../../../utils/cards";
import { CardDndID } from "../../../utils/cards/card-dnd";
import { reorderFollowingDrag } from "../../../utils/drag-support";
import { ServerData, GameStage, makeCardSetID } from "../server-side/server-data";

interface FromTo {
    from: CardDndID;
    to: CardDndID;
}

export function dragPermitted(state: ServerData, {to, from}: FromTo) : boolean {

    const fromID = makeCardSetID(from.handID);
    const toID = makeCardSetID(to.handID);
    
    if (fromID === toID && fromID !== "shared") {
        return true;
    }

    if (state.stage === GameStage.SettingBox) {
        return toID === "shared" || fromID === "shared";
    }

    if (state.stage === GameStage.Pegging) {
        return toID === "shared";
    } 

    sAssert(false, "Cannot determined result of dragPermitted");
}

function moveBetweenCardSets(
    fromCards: Card [], 
    fromIndex: number,
    toCards: Card[], 
    /** A null toIndex implied add to end */   
    toIndex: number  | null
) {
    const card = fromCards[fromIndex];
    fromCards.splice(fromIndex, 1);

    if (toIndex) {
        // Shuffle up cards at position toIndex or greater
        for (let i = toCards.length; i > toIndex; --i) {
            toCards[i] = toCards[i - 1];
        }

        toCards[toIndex] = card;
    } else {
        toCards.push(card);
    }
}

export function doDrag(state: ServerData, { to, from }: FromTo): void {

    if(!dragPermitted(state, { to, from })) {
        console.log("Attempted drag is not pemitted: from ", from, " to ", to);
        return;
    }

    const fromID = makeCardSetID(from.handID);
    const toID = makeCardSetID(to.handID);

    sAssert(from.index !== null);
    if (fromID === toID) {
        if(to.index !== null) {
            reorderFollowingDrag(state[fromID].hand, from.index, to.index);
        }
    } else {
        moveBetweenCardSets(
            state[fromID].hand, from.index,
            state[toID].hand, to.index,
        );
    }
}