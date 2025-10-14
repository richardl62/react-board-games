import { ServerData } from "./server-data";
import { MoveArg0 } from "@/game-controlX/move-fn";


export function showCutCard(
    {G} : MoveArg0<ServerData>,
    _arg: void): void {
    G.cutCard.visible = true;
}
