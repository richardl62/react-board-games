import { Ctx } from "boardgame.io";
import {  PegPositions, ServerData } from "./server-data";

interface Arg {
    who: "me" | "pone";
    score: number;
}


function movePeg(pegs: PegPositions, moveTo:number)  {
    const { score, trailingPeg} = pegs;
    // You can't move onto an existing peg.
    if(moveTo === score || moveTo === trailingPeg) {
        return;
    }

    if (moveTo > score) {
        // Standard move
        pegs.score = moveTo;
        pegs.trailingPeg = score;
    } else if (moveTo > trailingPeg) {
        // A backwards move ahead of the trailing peg.
        pegs.score = moveTo;
    } else {
        // A backwards move ahead behind the trailing peg.
        pegs.score = trailingPeg;
        pegs.trailingPeg = moveTo;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function pegClick(G: ServerData, ctx: Ctx, {who, score}: Arg): void {
    movePeg(G[who], score);
}
