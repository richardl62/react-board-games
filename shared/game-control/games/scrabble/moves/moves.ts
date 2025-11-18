import { Ctx } from "../../../ctx.js";
import { wrapMoveFunction as standardWrapMoveFunction } from "../../wrapped-move-function.js";
import { ClientMoveFunctions } from "../../../move-fn.js";
import { sAssert } from "../../../../utils/assert.js";
import { checkForWinner } from "./check-for-winner.js";
import { GameState } from "./game-state.js";
import { playWord } from "./play-word.js";
import { ServerData } from "../server-data.js";
import { swapTiles } from "./swap-tiles.js";
import { MoveArg0 } from "../../../move-fn.js";

type PassParam = void;
function pass(
    {G: state, ctx} : MoveArg0<GameState>,
    _param: PassParam) : void {
    state.moveHistory.push({pass: { pid: ctx.currentPlayer}});
}

type SimpleMoveFunc<P> = (arg0: MoveArg0<GameState>, param: P) => void;
type WrappedMoveFunc<P> = (arg0: MoveArg0<ServerData>, param: P) => void;

function nextPlayer(ctx: Ctx) {
    const {currentPlayer, playOrder, playOrderPos} = ctx;
    sAssert(currentPlayer === playOrder[playOrderPos], 
        "currentPlayer mismatch in context"
    );

    const next = (playOrderPos + 1) % playOrder.length;
    return playOrder[next]; 
}

function customWrappedMoveFunction<P>(func: SimpleMoveFunc<P>): WrappedMoveFunc<P> {
    return standardWrapMoveFunction((arg0, param) => {
        const { G, ctx, events } = arg0;
        const currentState = G.states[G.states.length - 1];
        sAssert(currentState.currentPlayer === ctx.currentPlayer,
            "Current player mismatch in state and context"
        );

        // KLUDGE/defensive - ensure copied state is fully independant.
        const newState: GameState = JSON.parse(JSON.stringify(currentState));
        newState.currentPlayer = nextPlayer(ctx);
        func({...arg0, G: newState}, param);

        G.states.push(newState);
        checkForWinner(newState, ctx);

        if (events) {
            events.endTurn();
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