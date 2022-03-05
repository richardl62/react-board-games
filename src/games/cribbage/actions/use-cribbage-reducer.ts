import { Dispatch, useReducer } from "react";
import { sAssert } from "../../../utils/assert";
import { reorderFollowingDrag } from "../../../utils/drag-support";
import { GameState, startingState } from "./game-state";


export type ActionType =
    { type: "showCutCard"} |
    { type: "dragWithinHand", data: { from: number, to: number} } |
    { type: "moveToBox", data: { from: number } }
;

function reducer(state: GameState, action: ActionType) : GameState {
    if (action.type === "showCutCard") {
        const newState = { ...state };
        newState.cutCard = { ...state.cutCard };
        newState.cutCard.visible = true;

        return newState;
    }

    if (action.type === "dragWithinHand") {
        const newState = { ...state };

        const { from, to } = action.data;
        reorderFollowingDrag(newState.me.hand, from, to);
        return newState;
    }

    if (action.type === "moveToBox") {
        const newState = { ...state };
        const { from } = action.data;

        const card = newState.me.hand[from];
        newState.me.hand.splice(from, 1);

        sAssert(newState.addingCardsToBox);
        newState.box.push(card);

        return newState;
    }

    throw new Error("Unexpected action in reducer");
}

export function useCribbageReducer(): [GameState, Dispatch<ActionType>] {
    return useReducer(reducer, startingState);
}


