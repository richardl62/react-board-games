import { ServerData } from "./server-data";
import { MoveArg0 } from "../../../boardgame-lib/game";

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
