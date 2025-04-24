import { ServerData, setSquares } from "./server-data";
import { MoveArg0 } from "../../../boardgame-lib/game";

export function reset(
    { G, random }: MoveArg0<ServerData>,  
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _arg: void) : void {
    setSquares(G, random);
}
