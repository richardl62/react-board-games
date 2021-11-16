import { sAssert } from "shared/assert";
import { CoreTile } from ".";
import { Letter } from "../config";
import { SquareID } from "./actions";
import { Rack, BoardAndRack } from "./board-and-rack";
import { BoardData } from "./game-data";

export interface GameState {
    board: BoardData,
    rack: Rack,
    bag: CoreTile[],
    externalTimestamp: number,
} 

export type ActionType =
    | { type: "move", data: {from: SquareID,to: SquareID}}
    | { type: "recallRack" }
    | { type: "shuffleRack" }
    | { type: "setBlank", data: {id: SquareID, letter: Letter}}
    | { type: "externalStateChange", data: GameState }
;

export function gameStateReducer(state : GameState, action: ActionType) : GameState {

    if(action.type === "externalStateChange") {
        const externalState = action.data;

        sAssert(externalState.externalTimestamp > state.externalTimestamp);
        return externalState;
    }

    const br = new BoardAndRack(state.board, state.rack);

    if(action.type === "move") {
        br.move(action.data);
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
    };
}
