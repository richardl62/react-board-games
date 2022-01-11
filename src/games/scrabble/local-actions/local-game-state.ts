import { sAssert } from "../../../shared/assert";
import { ScabbbleGameProps } from "../board/game-props";
import { Letter, ScrabbleConfig } from "../config";
import { Rack } from "./board-and-rack";
import { BoardData, GlobalGameState } from "../global-actions/global-game-state";

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

    // KLUDGE? This is (at time of writing) the members below only in sanity checks.
    scrabbleGameProps: ScabbbleGameProps;
    config: ScrabbleConfig;
}

export function getLocalGameState(scrabbleGameProps: ScabbbleGameProps, config: ScrabbleConfig): LocalGameState {
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
         * But also gives access to racks
        */
        playerData: G.playerData,
        
        /** Incremented when any of the state above is changed (and prehaps at
         * other times). */
        externalTimestamp: G.timestamp,

        /* KLUDGE?: See comment on type definition */
        scrabbleGameProps: scrabbleGameProps,
        config: config,
    };
}
