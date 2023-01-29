import { wrappedMoveFunction } from "../../../app-game-support/wrapped-move-function";
import { add } from "./add";

export const bgioMoves = {
    add: wrappedMoveFunction(add),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
type ClientFunction<F extends (a: any, b: any, c: any) => void> = (arg: Parameters<F>[2]) => void;

export interface ClientMoves {
    add: ClientFunction<typeof add>;
}

