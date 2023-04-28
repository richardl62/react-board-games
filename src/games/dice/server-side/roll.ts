import { ServerData } from "./server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";

export function roll(
    { G, random }: MoveArg0<ServerData>,
    _arg: void,  
): void {
    // Move held dice to start before rolling
    const newFaces = [];
    const newHeld = [];
    for (let i = 0; i < G.faces.length; i++) {
        if (G.held[i]) {
            newFaces.push(G.faces[i]);
            newHeld.push(true);
        }
    }
    newFaces.sort();
    
    for (let i = newFaces.length; i < G.faces.length; i++) {
        newFaces.push(random.Die(6));
        newHeld.push(false);
    }

    G.faces = newFaces;
    G.held = newHeld;

    G.rollCount++;
}
