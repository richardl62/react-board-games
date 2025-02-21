import { MoveArg0 } from "../../../boardgame-lib/game";
import { ServerData } from "./server-data";

export function throwError(
    _arg0: MoveArg0<ServerData>,
    message: string): void {
    throw new Error(message);
}
