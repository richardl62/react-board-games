import { reorderFollowingDrag } from "../../../utils/drag-support";
import { GameState } from "./game-state";


export type ActionType =
    { type: "showCutCard"} |
    { type: "dragWithinHand", data: {from: number, to: number} }
;

export function reducer(state : GameState, action: ActionType) : GameState {
    if(action.type === "showCutCard") {
        const newState = {...state};
        newState.cutCard = {...state.cutCard};
        newState.cutCard.visible = true;

        return newState;
    }

    if(action.type === "dragWithinHand") {
        const newState = {...state};

        const { from, to } = action.data;
        reorderFollowingDrag(newState.me.hand, from, to);
        return newState;
    }

    throw new Error("Unexpected action in reducer");
}

