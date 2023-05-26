import { MoveArg0 } from "../../../app-game-support/bgio-types";
import { ServerData } from "./server-data";

export function turnOver (
    { G, events }: MoveArg0<ServerData>,
    _arg: void,  
): void {
    G.scoreCarriedOver = 0;
    G.held.fill(false);
    G.diceScores = {
        held: 0,
        heldCategories: [],
        max: 0,
        prevRollHeld: 0,
    };
    G.turnOverRollCount = G.rollCount;
    events.endTurn();
}