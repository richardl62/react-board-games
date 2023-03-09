import { Ctx } from "boardgame.io";
import { ClientMoveFunctions, wrapMoveFunction as standardWrapMoveFunction } from "../../../app-game-support/wrap-move-functions";
import { sAssert } from "../../../utils/assert";
import { checkForWinner } from "./check-for-winner";
import { GameState } from "./game-state";
import { playWord } from "./play-word";
import { ServerData } from "./server-data";
import { swapTiles } from "./swap-tiles";

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

function customWrappedMoveFunction<P>(func: SimpleMoveFunc<P>): WrappedMoveFunc<P> {
    return standardWrapMoveFunction((G, ctx, param) => {
        const currentState = G.states[G.states.length - 1];
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
            throw new Error("Cannot end turn (internal error)");
        }
    });
}

export const bgioMoves = {
    playWord: customWrappedMoveFunction(playWord),
    swapTiles: customWrappedMoveFunction(swapTiles),
    pass: customWrappedMoveFunction(pass),
};

export type ClientMoves = ClientMoveFunctions<typeof bgioMoves>;