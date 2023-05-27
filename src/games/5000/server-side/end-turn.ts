import { MoveArg0 } from "../../../app-game-support/bgio-types";
import { ServerData } from "./server-data";

function turnOver (
    { G, events }: MoveArg0<ServerData>, 
): void {
    G.scoreCarriedOver = 0;
    G.held.fill(false);
    G.diceScores = {
        held: 0,
        heldCategories: [],
        nonScoringFaces: [...G.faces],
        max: 0,
        prevRollHeld: 0,
    };
    G.turnOverRollCount = G.rollCount;
    events.endTurn();
}

export function endTurnWithScore (
    arg0: MoveArg0<ServerData>,
    score: number,  
): void {
    const { G: {scoreToBeat, playerScores}, playerID } = arg0;

    if(scoreToBeat) {
        scoreToBeat.value = score;
        scoreToBeat.setBy = playerID;
    }

    playerScores[playerID].push(score);

    turnOver(arg0);
}

export function bust (
    arg0: MoveArg0<ServerData>,
    _arg: void,  
): void {
    const { G: {scoreToBeat}, playerID } = arg0;

    if(scoreToBeat?.setBy === playerID) {
        scoreToBeat.value = 0;
    }

    turnOver(arg0);
}