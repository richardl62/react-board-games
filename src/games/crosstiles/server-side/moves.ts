import { Ctx } from "boardgame.io";
import { changeSelectedTiles, ChangeSelectTilesParam } from "./select-tiles";
import { GameState, ServerData } from "./server-data";

type SimpleMoveFunc<P> = (state: GameState, ctx: Ctx, param: P) => void;
type WrappedMoveFunc<P> = (G: ServerData, ctx: Ctx, param: P) => void;

function wrappedMoveFunction<P>(func: SimpleMoveFunc<P> ) : WrappedMoveFunc<P> {
    return (G, ctx, param) => {
        G.serverError = null;
        try {
            func(G, ctx, param);
        } catch (error) {
            const message = error instanceof Error ? error.message :
                "unknown error";
            G.serverError = message;
        }

        G.timestamp++;
    };
}

export const bgioMoves = {
    changeSelectedTiles: wrappedMoveFunction(changeSelectedTiles),
};

export interface ClientMoves {
    changeSelectedTiles: (arg: ChangeSelectTilesParam) => void;
}
