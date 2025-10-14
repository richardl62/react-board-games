import { ServerData } from "../../server-side/server-data";
import { ReducerState } from "./cross-tiles-reducer";
import { makeEmptyGrid } from "../../server-side/make-empty-grid";

export function reflectServerData(state: ReducerState, newServerData: ServerData): ReducerState {

    const oldRound = state.serverData?.round;
    const newRound = newServerData.round;
    
    const { playerID, gridChangeTimestamp } = state;
    const {selectedLetters} = newServerData.playerData[playerID]; 

    if (oldRound != newRound) {
        return {
            rack: selectedLetters && [...selectedLetters],
            grid: makeEmptyGrid(),
            clickMoveStart: null,
            serverData: newServerData,

            playerID,
            gridChangeTimestamp,
        };
    }

    return { ...state, serverData: newServerData };
}
