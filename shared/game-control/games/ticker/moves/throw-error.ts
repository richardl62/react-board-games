import { MoveArg0 } from "../../../move-fn.js";
import { ServerData } from "../server-data.js";

export function throwError(
    _arg0: MoveArg0<ServerData>,
    message: string): void {
    throw new Error(message);
}
