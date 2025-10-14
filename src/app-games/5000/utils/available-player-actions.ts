import { ServerData } from "../server-side/server-data";

export interface PlayerActions {
    roll?: boolean;
    rollAll?: boolean;
    endTurn?: boolean;
    bust?: boolean;
}

// Return the available actions for the current player
export function availablePlayerActions(
    { faces, heldDice, prevRollHeldScore, held, maxDiceScore, turnOverRollCount, rollCount, 
        scoreCarriedOver, scoreToBeat, options }: ServerData
): PlayerActions {
    const actions : PlayerActions = {};
    if (turnOverRollCount === rollCount) {
        actions.rollAll = true;
    } else if (maxDiceScore <= prevRollHeldScore && !options.neverBust) {
        actions.bust = true;
    } else if (heldDice.score <= prevRollHeldScore && !options.neverBust) {
        // No available actions.
    } else {
        const stb = scoreToBeat? scoreToBeat.value : 0;
        if (heldDice.score + scoreCarriedOver > stb) {
            actions.endTurn = true;
        }

        if (heldDice.numScoringFaces === faces.length) {
            actions.rollAll = true;
        } else if (held.includes(false)) {
            actions.roll = true;
        } 
    }

    return actions;
}