import { Dispatch, useReducer } from "react";
import { sAssert } from "../../../utils/assert";
import { CardID } from "../../../utils/cards/card-dnd";
import { doDrag } from "./drag-support";
import { GameStage, GameState, startingState } from "./game-state";

export type ActionType =
    { type: "showCutCard"} |
    { type: "drag", data: {from:CardID, to: CardID} } |
    { type: "doneMakingBox"}
;

function deepCopyState(state: GameState) : GameState {
    return JSON.parse(JSON.stringify(state));  // inefficient
}


function reducerAction(state: GameState, action: ActionType) : GameState {
   
    if (action.type === "showCutCard") {
        state.cutCard.visible = true;
    } else if (action.type === "drag") {
        doDrag(state, action.data);
    } else if (action.type === "doneMakingBox") {
        sAssert(state.stage === GameStage.SettingBox);
        state.box = state.shared.hand;
        state.shared.hand = [];
        state.stage = GameStage.Pegging;
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


