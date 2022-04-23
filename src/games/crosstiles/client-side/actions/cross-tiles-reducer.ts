import { boardColumns, boardRows, Letter } from "../../config";
import { CrossTilesGameProps } from "./cross-tiles-game-props";
import { GridAndRack } from "./grid-and-rack";
import { tileClicked } from "./tile-clicked";
import { ClickMoveStart, SquareID } from "./types";

export type ReducerState = {
    rack: (Letter | null) [],
    grid: (Letter | null) [][];
    
    clickMoveStart: ClickMoveStart | null;
    
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

    clickMoveStart: null,

    externalTimestamp: -1,
};

export type ActionType =
    | { type: "externalStateChange", data: CrossTilesGameProps}
    | { type: "move", data: {from: SquareID, to: SquareID}} // Used after a drag
    | { type: "tileClicked", data: {id: SquareID}}
    | { type: "recallToRack"}
    | { type: "shuffleRack"}
    ;

export function crossTilesReducer(state : ReducerState, action: ActionType) : ReducerState {

    if(action.type === "externalStateChange") {
        return {
            ...state,
            externalTimestamp: action.data.G.timestamp,
        };
    }

    if(action.type === "tileClicked") {
        return tileClicked(state, action.data.id);
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
    
    if(action.type === "recallToRack") {
        const gr = new GridAndRack(state.grid, state.rack);
        gr.recallToRack();

        return {
            ...state,
            grid: gr.grid,
            rack: gr.rack,
        };
    }

    if(action.type === "shuffleRack") {
        const gr = new GridAndRack(state.grid, state.rack);
        gr.shuffleRack();

        return {
            ...state,
            grid: gr.grid,
            rack: gr.rack,
        };
    }

    throw Error("Unrecogined reduced action");
}
