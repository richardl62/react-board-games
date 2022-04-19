import { sAssert } from "../../../utils/assert";
import { nextCickMoveDirection } from "../../../utils/board/click-move-marker";
import { boardColumns, boardRows, Letter } from "../config";
import { CrossTilesGameProps } from "./cross-tiles-game-props";
import { GridAndRack } from "./grid-and-rack";
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

    clickMoveStart: {row: 1, col : 1, direction: "down"}, // For now

    externalTimestamp: -1,
};

export type ActionType =
    | { type: "externalStateChange", data: CrossTilesGameProps}
    | { type: "move", data: {from: SquareID, to: SquareID}} // Used after a drag
    | { type: "tileClicked", data: {id: SquareID}}
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
    
    if(action.type === "tileClicked") {
        return tileClicked(state, action.data.id);
    }
    throw Error("Unrecogined reduced action");
}


function tileClicked(state: ReducerState, id: SquareID): ReducerState {
    const gr = new GridAndRack(state.grid, state.rack);
    const cms = state.clickMoveStart;

    if(id.container === "grid" && gr.get(id) === null) {
        return {
            ...state,
            clickMoveStart: newClickMoveStart(cms, id),
        };
    }

    return state;
}

function newClickMoveStart(cms: ClickMoveStart | null, id: SquareID): ClickMoveStart | null {
    sAssert(id.container === "grid");
    
    const currentDirection = (cms && cms.row === id.row && cms.col === id.col) ? cms.direction : null;
    
    const newDirection = nextCickMoveDirection(currentDirection);


    return newDirection && {row: id.row, col: id.col, direction: newDirection};
}

