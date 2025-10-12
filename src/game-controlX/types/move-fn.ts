import { Ctx } from "./ctx";
import { EventsAPI } from "./events";
import { PlayerID } from "./playerid";
import { RandomAPI } from "./random-api";

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
    ...args: any[]
) => void | G;
