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
    
    /** Use to help with updates */
    serverData: ServerData | null,
    playerID: string;
};

export function initialReducerState(playerID: string): ReducerState {
    return {
        rack: null,
        grid: makeEmptyGrid(),

        clickMoveStart: null,

        serverData: null,
        playerID: playerID,
    };
}

export type ActionType =
    | { type: "reflectServerData", data: ServerData}
    | { type: "move", data: {from: SquareID, to: SquareID}} // Used after a drag
    | { type: "tileClicked", data: {id: SquareID}}
    | { type: "recallToRack"}
    | { type: "shuffleRack"}
    // Used on keypress in "making grids" stage
    | { type: "placeLetterFromRack", data: {letter: string}}
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
