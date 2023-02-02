import { Ctx } from "boardgame.io";
import { ServerData } from "./server-data";
import { playWord, PlayWordParam } from "./play-word";
import { swapTiles, SwapTilesParam } from "./swap-tiles";
import { GameState } from "./game-state";
import { sAssert } from "../../../utils/assert";
import { checkForWinner } from "./check-for-winner";

type PassParam = void;
function pass(state: GameState, ctx: Ctx, _param: PassParam) : void {
    state.moveHistory.push({pass: { pid: ctx.currentPlayer}});
}

type SimpleMoveFunc<P> = (state: GameState, ctx: Ctx, param: P) => void;
type WrappedMoveFunc<P> = (G: ServerData, ctx: Ctx, param: P) => void;

function nextPlayer(ctx: Ctx) {
    const {currentPlayer, playOrder, playOrderPos} = ctx;
    sAssert(currentPlayer === playOrder[playOrderPos]);

    const next = (playOrderPos + 1) % playOrder.length;
    return playOrder[next]; 
}

function wrappedMoveFunction<P>(func: SimpleMoveFunc<P> ) : WrappedMoveFunc<P> {
    return (G, ctx, param) => {
        G.serverError = null;
        try {
            const currentState = G.states[G.states.length-1];
            sAssert(currentState.currentPlayer === ctx.currentPlayer);
            
            // KLUDGE/defensive - ensure copied state is fully independant.
            const newState: GameState = JSON.parse(JSON.stringify(currentState));
            newState.currentPlayer = nextPlayer(ctx);
            func(newState, ctx, param);

            G.states.push(newState);
            checkForWinner(newState, ctx);

            if (ctx.events) {
                ctx.events.endTurn();
            } else {
                G.serverError = "Cannot end turn (internal error)";
            }
        } catch (error) {
            const message = error instanceof Error ? error.message :
                "unknown error";
            G.serverError = message;
            G.states[G.states.length-1].moveHistory.push({ serverError: { message: message } });
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
