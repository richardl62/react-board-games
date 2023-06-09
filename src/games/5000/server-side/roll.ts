import { ServerData } from "./server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";
import { getDiceScores } from "./get-dice-scores";
import { moveHeldFacesToStart } from "../utils/move-held-faces-to-start";
import { sAssert } from "../../../utils/assert";

export function roll(
    { G, random }: MoveArg0<ServerData>,
    {type, faces: newFaces}: {
        type: "all" | "unheld",

        // Intended for test/debugging purposes only.
        faces?: number[],
    },

): void {
    sAssert(newFaces === undefined || newFaces.length === G.faces.length, 
        "newFaces must be undefined or have the same length as G.faces");

    if(type === "all") {
        //set all dice to unheld
        for (let i = 0; i < G.faces.length; i++) {
            G.held[i] = false;
        }
        
        // Add the score from the previous roll to the carried over score
        G.scoreCarriedOver += G.diceScores.held;
    }

    const {faces, held} = moveHeldFacesToStart(G);

    for (let i = 0; i < faces.length; i++) {
        if(!held[i]) {
            faces[i] = random.Die(6);
        }
    }

    G.faces = newFaces || faces;
    G.held = held;

    // Calculate the score from the dice
    G.diceScores = {
        prevRollHeld: type === "unheld" ? G.diceScores.held : 0,
        ...getDiceScores(faces, held),
    };

    G.rollCount++;
}

