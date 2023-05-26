import { ServerData } from "./server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";
import { sAssert } from "../../../utils/assert";
import { getDiceScores } from "./get-dice-scores";

export function setHeld(
    { G }: MoveArg0<ServerData>,
    { index, held}: {index: number, held: boolean}  
): void {
    sAssert(G.held[index] !== undefined, "Bad index");
    G.held[index] = held;
    G.diceScores = {
        prevRollHeld: G.diceScores.prevRollHeld,
        ...getDiceScores(G.faces, G.held),
    };
}
