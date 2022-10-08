import { Dispatch, useReducer } from "react";
import { sAssert } from "../../../utils/assert";
import { GameStage, ServerData } from "../server-side/server-data";
import { startingServerData } from "../server-side/starting-server-data";

export type ActionType =
    { type: "doneMakingBox"} |
    { type: "restartPegging"} |
    { type: "donePegging"} |
    { type: "newDeal" }
;

function deepCopyState(state: ServerData) : ServerData {
    return JSON.parse(JSON.stringify(state));  // inefficient
}


function reducerModifyState(state: ServerData, action: ActionType) : ServerData {
   
    if (action.type === "doneMakingBox") {
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

function reducer(state: ServerData, action: ActionType) : ServerData {

    if (action.type === "newDeal") {
        return startingServerData();
    }
    
    return reducerModifyState(
        deepCopyState(state), // inefficient
        action
    );
}

export function useCribbageReducer(): [ServerData, Dispatch<ActionType>] {
    return useReducer(reducer, startingServerData());
}


