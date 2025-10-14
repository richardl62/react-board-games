import { sAssert } from "../../../../utils/assert";
import { Letter } from "../../config";
import { ServerData } from "../../server-side/server-data";
import { GridAndRack } from "./grid-and-rack";
import { makeEmptyGrid } from "../../server-side/make-empty-grid";
import { reflectServerData } from "./reflect-server-data";
import { tileClicked } from "./tile-clicked";
import { ClickMoveStart, SquareID } from "./types";

export type ReducerState = {
    rack: (Letter | null) [] | null,
    grid: (Letter | null) [][];
    
    clickMoveStart: ClickMoveStart | null;
    
    playerID: string;

    /** Use to help with updates */
    serverData: ServerData | null,

    /** Incremented after a (potential) user-made change made to the grid. 
     * (In practice, incremented on every reducer action, except reflecting server data.) */
    gridChangeTimestamp: number;
};

export function initialReducerState(playerID: string): ReducerState {
    return {
        rack: null,
        grid: makeEmptyGrid(),
        clickMoveStart: null,

        playerID: playerID,
        serverData: null,
        
        gridChangeTimestamp: 0,
    };
}

export type ActionType =
    | { type: "reflectServerData", data: ServerData}
    | { type: "move", data: {from: SquareID, to: SquareID}} // Used after a drag
    | { type: "tileClicked", data: {id: SquareID}}
    | { type: "clearClickMoveStart"}
    | { type: "recallToRack"}
    | { type: "shuffleRack"}
    // Used on keypress in "making grids" stage
    | { type: "placeLetterFromRack", data: {letter: string}}
    ;

/** Actions that should cause gridChangeTimestamp to be incremented. */
function gridChangeReducerActions(state : ReducerState, action: ActionType) : ReducerState {

    if(action.type === "tileClicked") {
        return tileClicked(state, action.data.id);
    }

    if(action.type === "clearClickMoveStart") {
        return {
            ...state,
            clickMoveStart: null,
        };
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

    if (action.type === "placeLetterFromRack") {
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

export function crossTilesReducer(state : ReducerState, action: ActionType) : ReducerState {

    if(action.type === "reflectServerData") {
        return reflectServerData(state, action.data);
    }

    const newState = gridChangeReducerActions(state,action);
    newState.gridChangeTimestamp++;
    return newState;
}
