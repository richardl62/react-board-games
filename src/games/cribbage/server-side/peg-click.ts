import {  PegPositions, PlayerID, ServerData } from "./server-data";
import { MoveArg0 } from "../../../boardgame-lib/game";

interface Arg {
    who: PlayerID;
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

export function pegClick(
    {G} : MoveArg0<ServerData>, 
    {who, score}: Arg
): void {
    movePeg(G[who], score);
}
