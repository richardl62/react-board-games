import { ServerData } from "./server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";
import { getDiceScores } from "./get-dice-scores";

export function rollAll(
    { G, random }: MoveArg0<ServerData>,
    _arg: void,  
): void {

    //set all dice to unheld
    for (let i = 0; i < G.faces.length; i++) {
        G.held[i] = false;
    }
    
    // Roll all dice
    for (let i = 0; i < G.faces.length; i++) {
        G.faces[i] = random.Die(6);
    }

    // Add the score from the previous roll to the carried over score
    G.scoreCarriedOver += G.diceScores.held;

    // Calculate the score from the dice
    G.diceScores = {
        prevRollHeld: 0,
        ...getDiceScores(G.faces, G.held),
    };


    G.rollCount++;
}