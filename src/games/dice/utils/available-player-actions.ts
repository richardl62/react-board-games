import { ServerData } from "../server-side/server-data";

export type PlayerActions = "roll" | "rollAll" | "done" | "bust"; 

// Return the available actions for the current player
export function availablePlayerActions(
    {diceScores, turnOverRollCount, rollCount} : ServerData
) : PlayerActions[] {
    if (turnOverRollCount === rollCount) {
        return ["rollAll"];
    } else if (diceScores.max <= diceScores.prevRollHeld) {
        return ["bust"];
    } else if (diceScores.held <= diceScores.prevRollHeld) {
        return [];
    } else {
        return ["roll", "done"];
    }
}