import { wrappedMoveFunction } from "../../../app-game-support/wrapped-move-function";
import { showCutCard } from "./show-cut-card";

export const bgioMoves = {
    showCutCard: wrappedMoveFunction(showCutCard),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
type ClientFunction<F extends (a: any, b: any, c: any) => void> = (arg: Parameters<F>[2]) => void;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ClientMoves {
    showCutCard: ClientFunction<typeof showCutCard>;
}
