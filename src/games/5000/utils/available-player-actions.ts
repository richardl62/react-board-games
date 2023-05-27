import { ServerData } from "../server-side/server-data";

export interface PlayerActions {
    roll?: boolean;
    rollAll?: boolean;
    endTurn?: boolean;
    bust?: boolean;
}

// Return the available actions for the current player
export function availablePlayerActions(
    { diceScores, held, turnOverRollCount, rollCount, scoreCarriedOver, scoreToBeat }: ServerData
): PlayerActions {
    const actions : PlayerActions = {};
    if (turnOverRollCount === rollCount) {
        actions.rollAll = true;
    } else if (diceScores.max <= diceScores.prevRollHeld) {
        actions.bust = true;
    } else if (diceScores.held <= diceScores.prevRollHeld) {
        // No available actions.
    } else {
        const stb = scoreToBeat? scoreToBeat.value : 0;
        if (diceScores.held + scoreCarriedOver > stb) {
            actions.endTurn = true;
        }

        if (diceScores.nonScoringFaces.length === 0) {
            actions.rollAll = true;
        } else if (held.includes(false)) {
            actions.roll = true;
        } 
    }

    return actions;
}