import { sAssert } from "../../../../utils/assert";
import { nextCickMoveDirection } from "../../../../utils/board/click-move-marker";
import { GridAndRack } from "./grid-and-rack";
import { ClickMoveStart, SquareID } from "./types";
import { ReducerState } from "./cross-tiles-reducer";

export function tileClicked(state: ReducerState, id: SquareID): ReducerState {
    sAssert(state.rack);
    const gr = new GridAndRack(state.grid, state.rack);
    const cms = state.clickMoveStart;
    const letter = gr.get(id);

    if (id.container === "grid" ) {
        if(letter === null) {
            return {
                ...state,
                clickMoveStart: newClickMoveStart(cms, id),
            };
        } else {
            gr.moveToRack(id);
            return {
                ...state,
                grid: gr.grid,
                rack: gr.rack,
            };
        }
    } else {
        sAssert(id.container === "rack");
    
        if (letter && cms ) {
            gr.moveFromRack(cms, id.col);
            return {
                ...state,
                grid: gr.grid,
                rack: gr.rack,
            };
        }
    }

    return state;
}

function newClickMoveStart(cms: ClickMoveStart | null, id: SquareID): ClickMoveStart | null {
    sAssert(id.container === "grid");

    const currentDirection = (cms && cms.row === id.row && cms.col === id.col) ? cms.direction : null;

    const newDirection = nextCickMoveDirection(currentDirection);


    return newDirection && { row: id.row, col: id.col, direction: newDirection };
}
