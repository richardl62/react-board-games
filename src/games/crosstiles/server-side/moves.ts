import { changeSelectedTiles, ChangeSelectTilesParam } from "./select-tiles";
import { wrappedMoveFunction } from "../../../app-game-support/wrapped-move-function";


export const bgioMoves = {
    changeSelectedTiles: wrappedMoveFunction(changeSelectedTiles),
};

export interface ClientMoves {
    changeSelectedTiles: (arg: ChangeSelectTilesParam) => void;
}
