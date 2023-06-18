import { MoveArg0 } from "../../../app-game-support/bgio-types";
import { ServerData } from "./server-data";

function turnOver (
    { G, events }: MoveArg0<ServerData>, 
): void {
    G.scoreCarriedOver = 0;
    G.held.fill(false);
    G.heldDice = {
        score: 0,
        categories: [],
        nonScoringFaces: [...G.faces],
    },
    G.maxDiceScore = 0;
    G.prevRollHeldScore = 0;
    
    G.turnOverRollCount = G.rollCount;
    events.endTurn();
}

export function endTurnNotBust (
    arg0: MoveArg0<ServerData>,
    _arg1: void,  
): void {
    const { G, playerID } = arg0;

    const score = G.scoreCarriedOver + G.heldDice.score;
    if(G.scoreToBeat) {
        G.scoreToBeat.value = score;
        G.scoreToBeat.setBy = playerID;
    }

    G.playerScores[playerID].push(score);

    turnOver(arg0);
}

export function endTurnBust (
    arg0: MoveArg0<ServerData>,
    _arg1: void,  
): void {
    const { G, playerID } = arg0;

    if(G.scoreToBeat?.setBy === playerID) {
        G.scoreToBeat.value = 0;
    }
    G.playerScores[playerID].push(0);
    
    turnOver(arg0);
}