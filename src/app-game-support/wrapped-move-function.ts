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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BgioMoveFuncs<S extends RequiredState> = {[key: string]: MoveFunc<S, any>};

export function wrappedMoveFunctions<S extends RequiredState>(unwrapped: BgioMoveFuncs<S>) : BgioMoveFuncs<S> {
    const obj : BgioMoveFuncs<S> = {};
    
    for (const [key, value] of Object.entries(unwrapped)) {
        obj[key] = wrappedMoveFunction(value);
    }

    return obj;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export type ClientFunction<F extends (a: any, b: any, c: any) => void> = (arg: Parameters<F>[2]) => void;

type Moves = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (a: any, b: Ctx, c: any) => void; 
}

export type ClientFunctionsT<Type extends Moves> = {
    [Property in keyof Type]: ClientFunction<Type[Property]>;
};