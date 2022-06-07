import { ServerData } from "../../server-side/server-data";
import { ReducerState } from "./cross-tiles-reducer";
import { makeEmptyGrid } from "../../server-side/make-empty-grid";

export function reflectServerData(state: ReducerState, newServerData: ServerData): ReducerState {

    const oldRound = state.serverData?.round;
    const newRound = newServerData.round;
    if (oldRound != newRound) {
        return {
            rack: [...newServerData.selectedLetters],
            grid: makeEmptyGrid(),
            clickMoveStart: null,
            serverData: newServerData,
        };
    }

    return { ...state, serverData: newServerData };
}
