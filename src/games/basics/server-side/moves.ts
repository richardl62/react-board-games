import { ClientFunction, wrappedMoveFunction } from "../../../app-game-support/wrapped-move-function";
import { add } from "./add";

export const bgioMoves = {
    add: wrappedMoveFunction(add),
};

export interface ClientMoves {
    add: ClientFunction<typeof add>;
}

