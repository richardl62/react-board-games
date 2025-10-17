import { ServerData } from "../server-data.js";
import { MoveArg0 } from "../../../move-fn.js";


export function showCutCard(
    {G} : MoveArg0<ServerData>,
    _arg: void): void {
    G.cutCard.visible = true;
}
