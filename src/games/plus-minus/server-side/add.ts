import { ServerData } from "./server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";


export function add(
    { G }: MoveArg0<ServerData>,  
    value: number): void {
    G.count += value;
    if(G.count < 0) {
        throw new Error("Count is negative (test of error handling)");
    }
}
