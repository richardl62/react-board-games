import { Letter } from "../config";
import { CrossTilesGameProps } from "./cross-tiles-game-props";

export type ReducerState = {
    selectedLetters: Letter[] | null,
    externalTimestamp: number,
};

export const initialReducerState : ReducerState = {
    selectedLetters: [],
    externalTimestamp: -1,
};

export type ActionType =
    | { type: "externalStateChange", data: CrossTilesGameProps}
    ;

export function crossTilesReducer(state : ReducerState, action: ActionType) : ReducerState {

    if(action.type === "externalStateChange") {
        return {
            selectedLetters: action.data.G.selectedLetters,
            externalTimestamp: action.data.G.timestamp,
        };
    }

    throw Error("Unrecogined reduced action");
}


