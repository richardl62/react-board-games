import { Dispatch, useReducer } from "react";
import { sAssert } from "../../../utils/assert";
import { Card } from "../../../utils/cards";
import { CardID } from "../../../utils/cards/card-dnd";
import { reorderFollowingDrag } from "../../../utils/drag-support";
import { GameState, makeCardSetID, startingState } from "./game-state";

export type ActionType =
    { type: "showCutCard"} |
    { type: "drag", data: {from:CardID, to: CardID} } |
    { type: "doneMakingBox"}
;

function deepCopyState(state: GameState) : GameState {
    return JSON.parse(JSON.stringify(state));  // inefficient
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

function reducerAction(state: GameState, action: ActionType) : GameState {
   
    if (action.type === "showCutCard") {
        state.cutCard.visible = true;
    } else if (action.type === "drag") {
        const { from, to } = action.data;
        const fromID = makeCardSetID(from.handID);
        const toID = makeCardSetID(to.handID);
    
        if(fromID === toID) {
            reorderFollowingDrag(state[fromID].hand, from.index, to.index);
        } else {
            moveBetweenCardSets(
                state[fromID].hand, from.index, 
                state[toID].hand, to.index,
            );
        }
    } else if (action.type === "doneMakingBox") {
        sAssert(state.box === null);
        state.box = state.shared.hand;
        state.shared.hand = [];
        state.toPeg = "me";
    } else {
        throw new Error("Unexpected action in reducer");
    }

    return state;
}

function reducer(state: GameState, action: ActionType) : GameState {
    return reducerAction(
        deepCopyState(state), // inefficient
        action
    );
}

export function useCribbageReducer(): [GameState, Dispatch<ActionType>] {
    return useReducer(reducer, startingState);
}


