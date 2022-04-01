import { sAssert } from "../../../utils/assert";
import { Rack } from "./board-and-rack";
import { BoardData, GameState } from "../server-side/game-state";

export interface LocalGameState {
    board: BoardData;
    rack: Rack;
    playerData: GameState["playerData"];
    nTilesInBag: number;
}

export function getLocalGameState(state: GameState, playerID: string): LocalGameState
{
    sAssert(state.playerData[playerID], "Player ID appears to be invalid");

    const rack = state.playerData[playerID].rack;
    return {
        board: state.board,
        rack: rack,
        nTilesInBag: state.bag.length,
        playerData: state.playerData,
    };
}
