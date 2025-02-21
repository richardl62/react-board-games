import { ServerData } from "./server-data";
import { MoveArg0 } from "../../../boardgame-lib/game";
import { setDiceScores } from "./set-dice-scores";

export function setHeld(
    { G }: MoveArg0<ServerData>,
    held: boolean[],  
): void {
    G.held = held;

    setDiceScores(G);
}
