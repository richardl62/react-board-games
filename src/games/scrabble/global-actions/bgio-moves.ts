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
        // KLUDGE/defensive - ensure copied state is fully independant.
        const state: GameState = JSON.parse(JSON.stringify(G.states[G.states.length-1]));

        G.serverError = null;
        try {
            func(state, ctx, param);
            G.states.push(state);
        } catch (error) {
            const message = error instanceof Error ? error.message :
                "unknown error";
            G.serverError = message;
            state.moveHistory.push({ serverError: { message: message } });
        }

        G.timestamp++;
    };
}

type DeleteHistoryAfterParam = number;

// Warning: Protype only.  Does not set the next player.
function deleteHistoryAfter(G: ServerData, ctx: Ctx, param: DeleteHistoryAfterParam) : void {
    if(!Number. isInteger(param) || param < 0 || param >= G.states.length ) {
        G.serverError = "Bad state index in deleteHistoryAfter";
    } else {
        G.serverError = "";
        G.states = G.states.slice(0, param+1);
    }
    G.timestamp++;
}

export const bgioMoves = {
    playWord: wrappedMoveFunction(playWord),
    swapTiles: wrappedMoveFunction(swapTiles),
    pass: wrappedMoveFunction(pass),

    // Warning: See implementation
    deleteHistoryAfter: deleteHistoryAfter, 
};

export interface ClientMoves {
    playWord: (arg: PlayWordParam) => void;
    swapTiles: (arg: SwapTilesParam) => void;
    pass: (arg: PassParam) => void;

    // Warning: See implementation
    deleteHistoryAfter: (arg: DeleteHistoryAfterParam) => void;
}
