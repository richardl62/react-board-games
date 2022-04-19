import { boardColumns, boardRows, Letter } from "../config";
import { CrossTilesGameProps } from "./cross-tiles-game-props";
import { GridAndRack } from "./grid-and-rack";
import { SquareID } from "./types";

export type ReducerState = {
    rack: (Letter | null) [],
    grid: (Letter | null) [][];
    externalTimestamp: number,
};

function makeEmptyBoard() : (Letter | null) [][] {
    const board : (Letter | null) [][] = [];

    const row = [];
    for(let c = 0; c < boardColumns; ++c) {
        row.push(null);
    }

    for(let r = 0; r < boardRows; r++) {
        board[r] = [...row];
    }
    return board;
}

export const initialReducerState : ReducerState = {
    rack: [ "A", "B", "C", "D", "E", "F", "I", "K"],
    grid:  makeEmptyBoard(),
    externalTimestamp: -1,
};

export type ActionType =
    | { type: "externalStateChange", data: CrossTilesGameProps}
    | { type: "move", data: {from: SquareID, to: SquareID}} // Used after a drag
    ;

export function crossTilesReducer(state : ReducerState, action: ActionType) : ReducerState {

    if(action.type === "externalStateChange") {
        return {
            ...state,
            externalTimestamp: action.data.G.timestamp,
        };
    }

    if(action.type === "move") {
        const gr = new GridAndRack(state.grid, state.rack);
        gr.move(action.data.from, action.data.to);

        return {
            ...state,
            grid: gr.grid,
            rack: gr.rack,
        };
    }
    throw Error("Unrecogined reduced action");
}


