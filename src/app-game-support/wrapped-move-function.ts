import { Ctx } from "boardgame.io";

export interface RequiredState  {
    serverError: string | null;
    serverTimestamp: number;
}

export type MoveFunc<State, Param> = (state: State, ctx: Ctx, param: Param) => void | State;

export function wrappedMoveFunction<State extends RequiredState, Param>(func: MoveFunc<State, Param>): MoveFunc<State, Param> {
    return (G, ctx, param) => {
        let errorMessage = null;
        let funcResult = undefined;
        try {
            funcResult = func(G, ctx, param);
        } catch (error) {
            errorMessage = error instanceof Error ? error.message :
                "unknown error";
        }

        if(funcResult) {
            return {
                ...funcResult,
                serverError: errorMessage, // No strictly necessary
                serverTimestamp: G.serverTimestamp+1,
            };
        } else {
            G.serverTimestamp++;
            G.serverError = errorMessage;
        }
    };
}
