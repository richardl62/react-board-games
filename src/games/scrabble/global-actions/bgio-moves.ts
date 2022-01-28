import { Ctx } from "boardgame.io";
import { GlobalGameState } from "./global-game-state";
import { playWord, PlayWordParam } from "./play-word";
import { swapTiles, SwapTilesParam } from "./swap-tiles";

type PassParam = void;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function pass(G: GlobalGameState, ctx: Ctx, _param: PassParam) : void {
    G.moveHistory.push({pass: { pid: ctx.currentPlayer}});
}

type MoveFunc<P> = (G: GlobalGameState, ctx: Ctx, param: P) => void;

function GameMove<P>(func: MoveFunc<P> ) : MoveFunc<P> {
    return (G, ctx, param) => {
        func(G, ctx, param);
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