import { Letter } from "../config";
import { CrossTilesGameProps } from "./cross-tiles-game-props";

export type ReducerState = {
    rack: Letter[] | null,
    externalTimestamp: number,
};

export const initialReducerState : ReducerState = {
    rack: [ "A", "B", "C", "D", "E", "F", "I", "K"],
    externalTimestamp: -1,
};

export type ActionType =
    | { type: "externalStateChange", data: CrossTilesGameProps}
    ;

export function crossTilesReducer(state : ReducerState, action: ActionType) : ReducerState {

    if(action.type === "externalStateChange") {
        return {
            ...state,
            externalTimestamp: action.data.G.timestamp,
        };
    }

    throw Error("Unrecogined reduced action");
}


