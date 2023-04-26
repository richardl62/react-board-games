import { ServerData } from "./server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";
import { sAssert } from "../../../utils/assert";

export function setHeld(
    { G }: MoveArg0<ServerData>,
    { index, held}: {index: number, held: boolean}  
): void {
    sAssert(G.held[index] !== undefined, "Bad index");
    G.held[index] = held;
}
