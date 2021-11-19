import { sAssert } from "shared/assert";
import { Letter } from "../config";
import { BoardAndRack } from "./board-and-rack";
import { SquareID } from "./game-actions";
import { ClickMoveDirection, ClickMoveStart, LocalGameState } from "./local-game-state";

export type ActionType =
    | { type: "move", data: {from: SquareID,to: SquareID}}
    | { type: "recallRack" }
    | { type: "shuffleRack" }
    | { type: "setBlank", data: {id: SquareID, letter: Letter}}
    | { type: "externalStateChange", data: LocalGameState }
    | { type: "setClickMoveStart", data: {row: number, col: number} }
    | { type: "clickMove", data: {rackPos: number}}
;

export function localGameStateReducer(state : LocalGameState, action: ActionType) : LocalGameState {

    if(action.type === "externalStateChange") {
        const externalState = action.data;

        sAssert(externalState.externalTimestamp > state.externalTimestamp);
        return externalState;
    }

    const br = new BoardAndRack(state.board, state.rack);
    
    let clickMoveStart = state.clickMoveStart;

    if(action.type === "setClickMoveStart") {
        const {row, col} = action.data;
        clickMoveStart = newClickMoveState(row, col, clickMoveStart);
    } else if(action.type === "move") {
        clickMoveStart = null;
        br.move(action.data);
    } else if(action.type === "clickMove") {
        if( state.clickMoveStart ) {
            br.clickMove({start: state.clickMoveStart, rackPos: action.data.rackPos});
        } else {
            console.warn("Attempted clickMove when start is not set");
        }
    } else if(action.type === "recallRack") {
        br.recallRack();
    } else if(action.type === "shuffleRack") {
        br.shuffleRack();
    } else if(action.type === "setBlank") {
        br.setBlack(action.data.id, action.data.letter);
    } else {
        console.warn("Unrecognised action in reducer:", action);
    }
    
    return {
        ...state,
        board: br.getBoard(),
        rack: br.getRack(),
        clickMoveStart: clickMoveStart,
    };
}
function newClickMoveState(row: number, col: number, oldCMS: ClickMoveStart | null): ClickMoveStart {
    let direction : ClickMoveDirection;
    if (oldCMS && oldCMS.row === row && oldCMS.col === col ) {
        // The previously selected square and be re-selected. This implies that the direction
        // should be toggled.
        direction = (oldCMS.direction === "right") ? "down" : "right";
    } else {
        // A new square had been picked so choice a default direction.
        direction = "right";
    }

    return {row: row, col: col, direction: direction };
}

