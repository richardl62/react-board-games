import { sAssert } from "../../../shared/assert";
import { ScabbbleGameProps } from "../board/game-props";
import { Letter } from "../config";
import { Rack } from "./board-and-rack";
import { BoardData, GlobalGameState } from "./global-game-state";

export type ClickMoveDirection = "right" | "down";

export interface ClickMoveStart {
    row: number;
    col: number;
    direction: ClickMoveDirection;
} 

export interface LocalGameState {
    board: BoardData;
    rack: Rack;

    clickMoveStart: ClickMoveStart | null;

    bag: Letter[];

    playerData: GlobalGameState["playerData"];
    externalTimestamp: number;
}

export function getLocalGameState(scrabbleGameProps: ScabbbleGameProps): LocalGameState {
    const {G, playerID } = scrabbleGameProps;

    // KLUDGE? - Not sure when playerID can be null.
    sAssert(playerID && G.playerData[playerID], "Player ID appears to be invalid");

    const rack = G.playerData[playerID].rack;
    return {
        board: G.board,
        rack: rack,

        clickMoveStart: null,
        bag: G.bag,
        
        /** KLUDGE?: Intended only to allow players scores to be seen. 
         * But also gives access to racks.s
        */
        playerData: G.playerData,
        
        /** Incremented when any of the state above is changed (and prehaps at
         * other times). */
        externalTimestamp: G.timestamp,
    };
}
