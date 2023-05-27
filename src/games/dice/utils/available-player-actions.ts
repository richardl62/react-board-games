import { ServerData } from "../server-side/server-data";

export type PlayerActions = "roll" | "rollAll" | "done" | "bust"; 

// Return the available actions for the current player
export function availablePlayerActions(
    { diceScores, held, turnOverRollCount, rollCount, scoreCarriedOver, scoreToBeat }: ServerData
): PlayerActions[] {
    if (turnOverRollCount === rollCount) {
        return ["rollAll"];
    } else if (diceScores.max <= diceScores.prevRollHeld) {
        return ["bust"];
    } else if (diceScores.held <= diceScores.prevRollHeld) {
        return [];
    } else {
        const actions: PlayerActions[] = [];
        const stb = scoreToBeat? scoreToBeat.value : 0;
        if (diceScores.held + scoreCarriedOver > stb) {
            actions.push("done");
        }

        if (diceScores.nonScoringFaces.length === 0) {
            actions.push("rollAll");
        } else if (held.includes(false)) {
            actions.push("roll");
        } 
        return actions;
    }
}