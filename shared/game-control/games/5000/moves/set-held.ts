import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";
import { setDiceScores } from "./set-dice-scores.js";

export function setHeld(
    { G }: MoveArg0<ServerData>,
    held: boolean[],  
): void {
    G.held = held;

    setDiceScores(G);
}
