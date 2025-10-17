import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";

export function swap(
    { G }: MoveArg0<ServerData>, 
    {from, to} : { from: number, to: number}
) : void {
    if (from !== to) {
        const tmp = G.squares[to];
        G.squares[to] = G.squares[from];
        G.squares[from] = tmp;
    }
}
