import { ServerData } from "./server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";
import { getDiceScores } from "./get-dice-scores";
import { moveHeldFacesToStart } from "../utils/move-held-faces-to-start";

export function roll(
    { G, random }: MoveArg0<ServerData>,
    _arg: void,  
): void {
    // Move held dice to start before rolling
    const {faces, held} = moveHeldFacesToStart(G);
    for (let i = 0; i < faces.length; i++) {
        if(!held[i]) {
            faces[i] = random.Die(6);
        }
    }

    G.faces = faces;
    G.held = held;

    // Calculate the score from the dice
    G.diceScores = {
        prevRollHeld: G.diceScores.held,
        ...getDiceScores(faces, held),
    };

    G.rollCount++;
}

