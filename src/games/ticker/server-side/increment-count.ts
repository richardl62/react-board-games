import { ServerData } from "./server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";

export function incrementCount(
    { G }: MoveArg0<ServerData>, 
    _arg: void): void {
    G.count++;
    console.log(`Count set to ${G.count} at ${Date().toLocaleString()}`);
}
