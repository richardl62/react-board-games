import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";

export function incrementCount(
    { G }: MoveArg0<ServerData>, 
    _arg: void): void {
    G.count++;
    console.log(`Count set to ${G.count} at ${Date().toLocaleString()}`);
}
