import { ClickMoveDirection } from "../../../utils/board/click-move-marker";
import { Letter } from "../config";
import { BoardAndRack } from "./board-and-rack";
import { SquareID } from "./game-actions";
import { ClickMoveStart, newReducerState, ReducerState, sanityCheck } from "./reducer-state";
import { ScrabbleGameProps } from "./srcabble-game-props";

export type ActionType =
    | { type: "move", data: {from: SquareID,to: SquareID}}
    | { type: "recallRack" }
    | { type: "shuffleRack" }
    | { type: "setBlank", data: {id: SquareID, letter: Letter}}
    | { type: "externalStateChange", data: ScrabbleGameProps }
    | { type: "setClickMoveStart", data: {row: number, col: number} }
    | { type: "clickMove", data: {rackPos: number}}
    | { type: "keydown", data: {key: string}}
    | { type: "enableGameHistory", data: {enable: boolean}}
    | { type: "setHistoryPosition", data: {position: number}}
    | { type: "focusInWordChecker", data: {focusIn: boolean}}

export function scrabbleReducer(state : ReducerState, action: ActionType) : ReducerState {

    if(action.type === "externalStateChange") {
        // The code is an edited copy of initialReducerState 
        const scrabbleGameProps : ScrabbleGameProps = action.data;
        return newReducerState(scrabbleGameProps, state);
    }

    if (action.type === "setHistoryPosition") {
        return newReducerState(state.scrabbleGameProps,
            { ...state, reviewGameHistory: { historyPosition: action.data.position } }
        );
    }

    if(action.type === "enableGameHistory") {
        // Reset history to lastest state (to allow moves to be made) when switching
        // off rewind controls. KLUDGE: Also reset when switching the controls on.
        const reviewGameHistory = action.data.enable && 
            {historyPosition: state.gameStates.length-1};

        return newReducerState(state.scrabbleGameProps, 
            {...state, reviewGameHistory: reviewGameHistory} );
    } 

    if (action.type === "focusInWordChecker") {
        return { ...state, focusInWordChecker: action.data.focusIn};
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
            br.moveFromRack({start: state.clickMoveStart, rackPos: action.data.rackPos});
        } else {
            console.warn("Attempted clickMove when start is not set");
        }
    } else if(action.type === "keydown") {
        if( !state.focusInWordChecker && state.clickMoveStart ) {
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
    } else {
        console.warn("Unrecognised action in reducer:", action);
    }

    const newState = {
        ...state,
        board: br.getBoard(),
        rack: br.getRack(),
        clickMoveStart: clickMoveStart,
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


