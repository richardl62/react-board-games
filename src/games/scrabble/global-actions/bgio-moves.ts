import { Ctx } from "boardgame.io";
import { ServerData } from "./server-data";
import { playWord, PlayWordParam } from "./play-word";
import { swapTiles, SwapTilesParam } from "./swap-tiles";
import { GameState } from "./game-state";

type PassParam = void;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function pass(state: GameState, ctx: Ctx, _param: PassParam) : void {
    state.moveHistory.push({pass: { pid: ctx.currentPlayer}});
}

type SimpleMoveFunc<P> = (state: GameState, ctx: Ctx, param: P) => void;
type WrappedMoveFunc<P> = (G: ServerData, ctx: Ctx, param: P) => void;

function wrappedMoveFunction<P>(func: SimpleMoveFunc<P> ) : WrappedMoveFunc<P> {
    return (G, ctx, param) => {
        const state = G.states[G.currentState];
        G.serverError = null;
        try {
            func(state, ctx, param);
        } catch(error) {
            const message = error instanceof Error ? error.message : 
                "unknown error";
            G.serverError = message;
            state.moveHistory.push({serverError: {message: message}});
        }
        G.timestamp++;
    };
}

export const bgioMoves = {
    playWord: wrappedMoveFunction(playWord),
    swapTiles: wrappedMoveFunction(swapTiles),
    pass: wrappedMoveFunction(pass),
};

export interface ClientMoves {
    playWord: (arg: PlayWordParam) => void;
    swapTiles: (arg: SwapTilesParam) => void;
    pass: (arg: PassParam) => void;
}