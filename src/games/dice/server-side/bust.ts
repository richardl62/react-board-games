import { MoveArg0 } from "../../../app-game-support/bgio-types";
import { ServerData } from "./server-data";

export function bust (
    { G }: MoveArg0<ServerData>,
    _arg: void,  
): void {
    G.bustRollCount = G.rollCount;
}