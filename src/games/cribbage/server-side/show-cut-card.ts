import { ServerData } from "./server-data";
import { MoveArg0 } from "../../../app-game-support/bgio-types";


export function showCutCard(
    {G} : MoveArg0<ServerData>,
    _arg: void): void {
    G.cutCard.visible = true;
}
