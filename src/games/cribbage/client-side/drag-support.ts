import { sAssert } from "../../../utils/assert";
import { Card } from "../../../utils/cards";
import { CardID } from "../../../utils/cards/card-dnd";
import { reorderFollowingDrag } from "../../../utils/drag-support";
import { GameState, makeCardSetID } from "./game-state";

interface FromTo {
    from: CardID;
    to: CardID;
}

export function dragPermitted(state: GameState, {to, from}: FromTo) : boolean {

    const fromID = makeCardSetID(from.handID);
    const toID = makeCardSetID(to.handID);
    
    if (fromID === toID ) {
        return true;
    }

    if (state.box === null) {
        return toID === "shared" || fromID === "shared";
    }

    if (state.toPeg) {
        return toID === state.toPeg && fromID === "shared";
        return true;
    } 

    sAssert(false, "Cannot determined result of dragPermitted");
}

function moveBetweenCardSets(
    fromCards: Card [], fromIndex: number,
    toCards: Card[],    toIndex: number 
) {
    const card = fromCards[fromIndex];
    fromCards.splice(fromIndex, 1);

    // Shuffle up cards at position toIndex or greater
    for(let i = toCards.length; i > toIndex; --i) {
        toCards[i] = toCards[i-1];
    }

    toCards[toIndex] = card;
}

export function doDrag(state: GameState, { to, from }: FromTo): void {

    if(!dragPermitted(state, { to, from })) {
        console.log("Attempted drag is not pemitted: from ", from, " to ", to);
        return;
    }

    const fromID = makeCardSetID(from.handID);
    const toID = makeCardSetID(to.handID);

    if (fromID === toID) {
        reorderFollowingDrag(state[fromID].hand, from.index, to.index);
    } else {
        moveBetweenCardSets(
            state[fromID].hand, from.index,
            state[toID].hand, to.index,
        );
    }
}