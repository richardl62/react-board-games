import { sAssert } from "../../../../utils/assert";
import { boardColumns, boardRows, Letter } from "../../config";
import { ServerData } from "../../server-side/server-data";
import { GridAndRack } from "./grid-and-rack";
import { tileClicked } from "./tile-clicked";
import { ClickMoveStart, SquareID } from "./types";

export type ReducerState = {
    rack: (Letter | null) [] | null,
    grid: (Letter | null) [][];
    
    clickMoveStart: ClickMoveStart | null;
    
    /** Use to help with updates */
    serverData: ServerData | null,
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
    rack: null,
    grid:  makeEmptyBoard(),

    clickMoveStart: null,

    serverData: null,
};

export type ActionType =
    | { type: "reflectServerData", data: ServerData}
    | { type: "move", data: {from: SquareID, to: SquareID}} // Used after a drag
    | { type: "tileClicked", data: {id: SquareID}}
    | { type: "recallToRack"}
    | { type: "shuffleRack"}
    ;

export function crossTilesReducer(state : ReducerState, action: ActionType) : ReducerState {
 
    if(action.type === "reflectServerData") {
        return reflectServerData(state, action.data);
    }

    if(action.type === "tileClicked") {
        return tileClicked(state, action.data.id);
    }
    
    if(action.type === "move") {
        sAssert(state.rack);
        const gr = new GridAndRack(state.grid, state.rack);
        gr.move(action.data.from, action.data.to);

        return {
            ...state,
            grid: gr.grid,
            rack: gr.rack,
        };
    }
    
    if(action.type === "recallToRack") {
        sAssert(state.rack);
        const gr = new GridAndRack(state.grid, state.rack);
        gr.recallToRack();

        return {
            ...state,
            grid: gr.grid,
            rack: gr.rack,
        };
    }

    if(action.type === "shuffleRack") {
        sAssert(state.rack);
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

function reflectServerData(state: ReducerState, newServerData: ServerData): ReducerState {

    const newState = {
        ...state,   
        serverData: newServerData,
    };
   
    const newSelectedLetters = newServerData.selectedLetters;
    if(newSelectedLetters) {
        newState.rack = [...newSelectedLetters];
    }

    return newState;
}

