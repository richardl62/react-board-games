import { Ctx } from "boardgame.io";

export interface RequiredState  {
    serverError: string | null;
    timestamp: number;
}

export type MoveFunc<State, Param> = (state: State, ctx: Ctx, param: Param) => void;

export function wrappedMoveFunction<State extends RequiredState, Param>(func: MoveFunc<State, Param>): MoveFunc<State, Param> {
    return (G, ctx, param) => {
        G.serverError = null;
        try {
            func(G, ctx, param);
        } catch (error) {
            const message = error instanceof Error ? error.message :
                "unknown error";
            G.serverError = message;
        }

        G.timestamp++;
    };
}
