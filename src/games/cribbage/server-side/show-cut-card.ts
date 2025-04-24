import { ServerData } from "./server-data";
import { MoveArg0 } from "../../../boardgame-lib/game";


export function showCutCard(
    {G} : MoveArg0<ServerData>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _arg: void): void {
    G.cutCard.visible = true;
}
