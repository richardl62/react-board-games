import { Ctx } from "./ctx.js";
import { EventsAPI } from "./events.js";
import { PlayerID } from "./playerid.js";
import { RandomAPI } from "../utils/random-api.js";

export interface MoveArg0<G> {
    G: G;
    ctx: Ctx;
    playerID: PlayerID;
    random: RandomAPI;
    events: EventsAPI;
}

export type MoveFn<G> = (
    context: MoveArg0<G>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arg: any
) => void | G;

export type ClientMoveFunctions<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    functions extends { [key: string]: MoveFn<any>; }
> = {
        [Name in keyof functions]: (arg: Parameters<functions[Name]>[1]) => void;
    };
