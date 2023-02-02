import { Ctx } from "boardgame.io";

export interface RequiredState  {
    serverError: string | null;
    serverTimestamp: number;
}

type MoveFunction<State, Param> = (state: State, ctx: Ctx, param: Param) => void | State;

export function wrapMoveFunction<State extends RequiredState, Param>(func: MoveFunction<State, Param>): MoveFunction<State, Param> {
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
                serverError: errorMessage, // Not strictly necessary
                serverTimestamp: G.serverTimestamp+1,
            };
        } else {
            G.serverTimestamp++;
            G.serverError = errorMessage;
        }
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MoveFunctions<S extends RequiredState> = {[key: string]: MoveFunction<S, any>};

export function wrapMoveFunctions<S extends RequiredState>(unwrapped: MoveFunctions<S>) 
    : MoveFunctions<S> {
    const obj : MoveFunctions<S> = {};
    
    for (const [key, value] of Object.entries(unwrapped)) {
        obj[key] = wrapMoveFunction(value);
    }

    return obj;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export type ClientFunctionFunction<F extends MoveFunction<any,any>> = (arg: Parameters<F>[2]) => void;

type Moves = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: MoveFunction<any,any>; 
}

export type ClientMoveFunctions<Type extends Moves> = {
    [Property in keyof Type]: ClientFunctionFunction<Type[Property]>;
};