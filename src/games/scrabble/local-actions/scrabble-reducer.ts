import { Letter } from "../config";
import { BoardAndRack } from "./board-and-rack";
import { SquareID } from "./game-actions";
import { ClickMoveDirection, ClickMoveStart, ReducerState, sanityCheck } from "./reducer-state";
import { ScabbbleGameProps } from "../board/game-props";
import { getLocalGameState } from "./local-game-state";

export type ActionType =
    | { type: "move", data: {from: SquareID,to: SquareID}}
    | { type: "recallRack" }
    | { type: "shuffleRack" }
    | { type: "setBlank", data: {id: SquareID, letter: Letter}}
    | { type: "externalStateChange", data: ScabbbleGameProps }
    | { type: "setClickMoveStart", data: {row: number, col: number} }
    | { type: "clickMove", data: {rackPos: number}}
    | { type: "keydown", data: {key: string}}
    | { type: "setShowRewindControls", data: {show: boolean}}
    | { type: "setHistoryPosition", data: {position: number}}

export function scrabbleReducer(state : ReducerState, action: ActionType) : ReducerState {

    if(action.type === "externalStateChange") {
        // The code is an edited copy of initialReducerState 
        const scrabbleGameProps : ScabbbleGameProps = action.data;
        const { states, timestamp } = scrabbleGameProps.G;
        const historyPosition = states.length - 1;
        
        return {
            ...state,

            ...getLocalGameState(states[historyPosition], scrabbleGameProps.playerID),
            
            gameStates: states,
            historyPosition: states.length-1,
            externalTimestamp: timestamp,
            scrabbleGameProps: scrabbleGameProps,
        };
    }

    const br = new BoardAndRack(state.board, state.rack);
    
    let clickMoveStart = state.clickMoveStart;
    let showRewindControls = state.showRewindControls;

    if(action.type === "setClickMoveStart") {
        const {row, col} = action.data;
        clickMoveStart = newClickMoveState(row, col, clickMoveStart);
    } else if(action.type === "move") {
        clickMoveStart = null;
        br.move(action.data);
    } else if(action.type === "clickMove") {
        if( state.clickMoveStart ) {
            br.moveFromRack({start: state.clickMoveStart, rackPos: action.data.rackPos});
        } else {
            console.warn("Attempted clickMove when start is not set");
        }
    } else if(action.type === "keydown") {
        if( state.clickMoveStart ) {
            const rackPos = br.findInRack(action.data.key);
            if (rackPos !== null) {
                br.moveFromRack({start: state.clickMoveStart, rackPos: rackPos});
            }
        }
    } else if(action.type === "recallRack") {
        br.recallRack();
    } else if(action.type === "shuffleRack") {
        br.shuffleRack();
    } else if(action.type === "setBlank") {
        br.setBlack(action.data.id, action.data.letter);
    } else if(action.type === "setShowRewindControls") {
        showRewindControls = action.data.show;
    } else {
        console.warn("Unrecognised action in reducer:", action);
    }
    
    const newState = {
        ...state,
        board: br.getBoard(),
        rack: br.getRack(),
        clickMoveStart: clickMoveStart,
        showRewindControls: showRewindControls,
    };

    const sanityProblem = sanityCheck(newState);
    if(sanityProblem) {
        alert(sanityProblem);
    }

    return newState;
}

function newClickMoveState(row: number, col: number, oldCMS: ClickMoveStart | null): ClickMoveStart | null {
    let direction : ClickMoveDirection | null;

    // If the same square is clicked multiple times, the arrow cycles
    // in the order right, down, none.
    if (oldCMS && oldCMS.row === row && oldCMS.col === col ) {
        direction = (oldCMS.direction === "right") ? "down" : null;
    } else {
        // A new square has been picked so choice the default direction.
        direction = "right";
    }

    return direction && {row: row, col: col, direction: direction };
}


