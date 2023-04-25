import { ServerData } from "./server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";

export function roll(
    { G, random }: MoveArg0<ServerData>,
    _arg: void,  
): void {
    const faces = G.faces;
    for (let i = 0; i < faces.length; i++) {
        faces[i] = random.Die(6);
    }
}
