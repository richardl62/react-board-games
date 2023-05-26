import { ServerData } from "../server-side/server-data";

export type PlayerActions = "roll" | "rollAll" | "done" | "bust"; 

// Return the available actions for the current player
export function availablePlayerActions(
    {diceScores, held, turnOverRollCount, rollCount} : ServerData
) : PlayerActions[] {
    if (turnOverRollCount === rollCount) {
        return ["rollAll"];
    } else if (diceScores.max <= diceScores.prevRollHeld) {
        return ["bust"];
    } else if (diceScores.held <= diceScores.prevRollHeld) {
        return [];
    } else if(diceScores.nonScoringFaces.length === 0) {
        return ["rollAll", "done"];
    } else if (held.every(h => h)) {
        return ["done"];
    } else {
        return ["roll", "done"];
    }
}