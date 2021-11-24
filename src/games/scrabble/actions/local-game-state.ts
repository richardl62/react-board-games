import { sAssert } from "../../../shared/assert";
import { BgioGameProps } from "../../../shared/bgio-game-props";
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

export function getLocalGameState(props: BgioGameProps<GlobalGameState>): LocalGameState {
    const playerID = props.playerID;
    sAssert(playerID); // KLUDGE? - Not sure when it can be null.

    return {
        board: props.G.board,
        rack: props.G.playerData[playerID].playableTiles,

        clickMoveStart: null,
        bag: props.G.bag,
        
        /** KLUDGE?: Intended only to allow players scores to be seen. 
         * But also gives access to racks.
        */
        playerData: props.G.playerData,
        
        /** Incremented when any of the state above is changed (and prehaps at
         * other times). */
        externalTimestamp: props.G.timestamp,
    };
}
