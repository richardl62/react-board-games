import { ServerData } from "./server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";
import { getDiceScores } from "./get-dice-scores";

export function setHeld(
    { G }: MoveArg0<ServerData>,
    held: boolean[],  
): void {
    G.held = held;
    G.diceScores = {
        prevRollHeld: G.diceScores.prevRollHeld,
        ...getDiceScores(G.faces, G.held),
    };
}
