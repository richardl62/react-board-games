import { ServerData, setSquares } from "./server-data";
import { MoveArg0 } from "../../../boardgame-lib/game";

export function reset(
    { G, random }: MoveArg0<ServerData>,  
    _arg: void) : void {
    setSquares(G, random);
}
