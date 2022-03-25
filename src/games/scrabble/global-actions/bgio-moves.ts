import { Ctx } from "boardgame.io";
import { ServerData } from "./game-state";
import { playWord, PlayWordParam } from "./play-word";
import { swapTiles, SwapTilesParam } from "./swap-tiles";

type PassParam = void;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function pass(G: ServerData, ctx: Ctx, _param: PassParam) : void {
    G.state.moveHistory.push({pass: { pid: ctx.currentPlayer}});
}

type MoveFunc<P> = (G: ServerData, ctx: Ctx, param: P) => void;

function GameMove<P>(func: MoveFunc<P> ) : MoveFunc<P> {
    return (G, ctx, param) => {
        G.serverError = null;
        try {
            func(G, ctx, param);
        } catch(error) {
            const message = error instanceof Error ? error.message : 
                "unknown error";
            G.serverError = message;
            G.state.moveHistory.push({serverError: {message: message}});
        }
        G.timestamp++;
    };
}

export const bgioMoves = {
    playWord: GameMove(playWord),
    swapTiles: GameMove(swapTiles),
    pass: GameMove(pass),
};

export interface ClientMoves {
    playWord: (arg: PlayWordParam) => void;
    swapTiles: (arg: SwapTilesParam) => void;
    pass: (arg: PassParam) => void;
}