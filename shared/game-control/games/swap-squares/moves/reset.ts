import { ServerData, setSquares } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";

export function reset(
    { G, random }: MoveArg0<ServerData>,  
    _arg: void) : void {
    setSquares(G, random);
}
