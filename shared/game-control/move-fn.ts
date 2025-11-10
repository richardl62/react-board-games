import { Ctx } from "./ctx.js";
import { EventsAPI } from "./events.js";
import { PlayerID } from "./playerid.js";
import { RandomAPI } from "./random-api.js";

export interface MoveArg0<G> {
    G: G;
    ctx: Ctx;
    playerID: PlayerID;
    random: RandomAPI;
    events: Required<EventsAPI>; // Use of Required<> is a kludge.
}

export type MoveFn<G> = (
    context: MoveArg0<G>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arg: any
) => void | G;
