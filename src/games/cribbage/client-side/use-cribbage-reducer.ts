import { Dispatch, useReducer } from "react";
import { Card } from "../../../utils/cards";
import { CardID } from "../../../utils/cards/card-dnd";
import { reorderFollowingDrag } from "../../../utils/drag-support";
import { GameState, makeCardSetID, startingState } from "./game-state";

export type ActionType =
    { type: "showCutCard"} |
    { type: "drag", data: {from:CardID, to: CardID} } 
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

function reducer(state: GameState, action: ActionType) : GameState {
    if (action.type === "showCutCard") {
        const newState = deepCopyState(state); // inefficient

        newState.cutCard.visible = true;

        return newState;
    }

    if (action.type === "drag") {
        const newState = deepCopyState(state); // inefficient

        const { from, to } = action.data;
        const fromID = makeCardSetID(from.handID);
        const toID = makeCardSetID(to.handID);
    
        if(fromID === toID) {
            reorderFollowingDrag(newState[fromID].hand, from.index, to.index);
        } else {
            moveBetweenCardSets(
                newState[fromID].hand, from.index, 
                newState[toID].hand, to.index,
            );
        }
        return newState;
    }

    throw new Error("Unexpected action in reducer");
}

export function useCribbageReducer(): [GameState, Dispatch<ActionType>] {
    return useReducer(reducer, startingState);
}


