import { Dispatch, useReducer } from "react";
import { CardID } from "../../../utils/cards/card-dnd";
import { reorderFollowingDrag } from "../../../utils/drag-support";
import { GameState, startingState } from "./game-state";

export type ActionType =
    { type: "showCutCard"} |
    { type: "drag", data: {from:CardID, to: CardID} } 
;

function deepCopyState(state: GameState) : GameState {
    return JSON.parse(JSON.stringify(state));  // inefficient
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
        if(from.handID === "me" && to.handID === "me") {
            reorderFollowingDrag(newState.me.hand, from.index, to.index);
        } else if (from.handID === "me" && to.handID === "dropSpot")  {
            const card = newState.me.hand[from.index];
            newState.me.hand = [...newState.me.hand];
            newState.me.hand.splice(from.index, 1);
            newState.box.push(card);
        }
        return newState;
    }

    throw new Error("Unexpected action in reducer");
}

export function useCribbageReducer(): [GameState, Dispatch<ActionType>] {
    return useReducer(reducer, startingState);
}


