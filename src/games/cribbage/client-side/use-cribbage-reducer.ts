import { Dispatch, useReducer } from "react";
import { sAssert } from "../../../utils/assert";
import { CardDndID } from "../../../utils/cards/card-dnd";
import { doDrag } from "./drag-support";
import { GameStage, GameState } from "./game-state";
import { makeGameState } from "./make-game-state";

export type ActionType =
    { type: "showCutCard"} |
    { type: "drag", data: {from:CardDndID, to: CardDndID} } |
    { type: "doneMakingBox"} |
    { type: "restartPegging"} |
    { type: "donePegging"} |
    { type: "newDeal" }
;

function deepCopyState(state: GameState) : GameState {
    return JSON.parse(JSON.stringify(state));  // inefficient
}


function reducerModifyState(state: GameState, action: ActionType) : GameState {
   
    if (action.type === "showCutCard") {
        state.cutCard.visible = true;
    } else if (action.type === "drag") {
        doDrag(state, action.data);
    } else if (action.type === "doneMakingBox") {
        sAssert(state.stage === GameStage.SettingBox);
        state.me.fullHand = [...state.me.hand];
        state.pone.fullHand = [...state.pone.hand];

        state.box = state.shared.hand;

        state.shared.hand = [];
        state.stage = GameStage.Pegging;
    } else if (action.type === "restartPegging") {
        state.shared.hand = [];
    } else if (action.type === "donePegging") {
        state.me.hand = [...state.me.fullHand];
        state.pone.hand = [...state.pone.fullHand];
        state.shared.hand = state.box;
        state.box = [];

        state.stage = GameStage.Scoring;
    } else {
        throw new Error("Unexpected action in reducer");
    }

    return state;
}

function reducer(state: GameState, action: ActionType) : GameState {

    if (action.type === "newDeal") {
        return makeGameState();
    }
    
    return reducerModifyState(
        deepCopyState(state), // inefficient
        action
    );
}

export function useCribbageReducer(): [GameState, Dispatch<ActionType>] {
    return useReducer(reducer, makeGameState());
}


