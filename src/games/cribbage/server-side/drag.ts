import { sAssert } from "../../../utils/assert";
import { Card } from "../../../utils/cards";
import { reorderFollowingDrag } from "../../../utils/reorder-following-drag";
import { ServerData, GameStage, makeCardSetID, CardSetID } from "./server-data";
import { MoveArg0 } from "../../../boardgame-lib/game";

interface FromTo {
    from:  {cardSetID: CardSetID, index: number};
    to: {cardSetID: CardSetID, index?: number};
}

function dragPermitted(state: ServerData, {to, from}: FromTo) : boolean {

    const fromID = makeCardSetID(from.cardSetID);
    const toID = makeCardSetID(to.cardSetID);
    
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
    toIndex?: number,
) {
    const card = fromCards.splice(fromIndex, 1)[0];

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

export function drag(
    {G: state} : MoveArg0<ServerData>, 
    { to, from }: FromTo
): void {

    if(!dragPermitted(state, { to, from })) {
        console.log("Attempted drag is not pemitted: from ", from, " to ", to);
        return;
    }

    const fromID = makeCardSetID(from.cardSetID);
    const toID = makeCardSetID(to.cardSetID);

    sAssert(from.index !== null);
    if (fromID === toID) {
        if(to.index !== undefined) {
            reorderFollowingDrag(state[fromID].hand, from.index, to.index);
        }
    } else if (state.stage === GameStage.Pegging) {
        sAssert(toID === "shared", "unexpected action during pegging");
        const card = state[fromID].hand.splice(from.index, 1)[0];
        state[toID].hand.push(card);
    } else {
        moveBetweenCardSets(
            state[fromID].hand, from.index,
            state[toID].hand, to.index,
        );
    }
}