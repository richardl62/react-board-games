import { formatDiagnostic } from "typescript";
import { sAssert } from "../../../../utils/assert";
import { boardColumns, boardRows, Letter } from "../../config";
import { ServerData } from "../../server-side/server-data";
import { GridAndRack } from "./grid-and-rack";
import { reflectServerData } from "./reflect-server-data";
import { tileClicked } from "./tile-clicked";
import { ClickMoveStart, SquareID } from "./types";

export type ReducerState = {
    rack: (Letter | null) [] | null,
    grid: (Letter | null) [][];
    
    clickMoveStart: ClickMoveStart | null;
    
    /** Use to help with updates */
    serverData: ServerData | null,
};

export function makeEmptyGrid() : (Letter | null) [][] {
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
    grid:  makeEmptyGrid(),

    clickMoveStart: null,

    serverData: null,
};

export type ActionType =
    | { type: "reflectServerData", data: ServerData}
    | { type: "move", data: {from: SquareID, to: SquareID}} // Used after a drag
    | { type: "tileClicked", data: {id: SquareID}}
    | { type: "recallToRack"}
    | { type: "shuffleRack"}
    // Used on keypress is "making grids" stage
    | { type: "moveFromRack", data: {letter: string}}
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

    if (action.type === "moveFromRack") {
        const { rack, clickMoveStart } = state;

        if (rack && clickMoveStart) {
            const gr = new GridAndRack(state.grid, rack);
            const rackPos = gr.findInRack(action.data.letter);
            if (rackPos !== null) {
                gr.moveFromRack(clickMoveStart, rackPos );

                return {
                    ...state,
                    grid: gr.grid,
                    rack: gr.rack,
                };
            }
        }

        return state;
    }

    throw Error("Unrecogined reduced action");
}


