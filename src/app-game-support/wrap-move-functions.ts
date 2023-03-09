import { Ctx } from "boardgame.io";

export interface RequiredState  {
    /** Description of the exception, if any, thrown during the last move.
     *  Set in wrapMoveFunction.
     */
    moveError: string | null;

    /** Count of moves. Set in wrapMoveFunction. */
    moveCount: number;
}

type BgioMoveFunction<State, Param> = (state: State, ctx: Ctx, param: Param) => void | State;

export function wrapMoveFunction<State extends RequiredState, Param>(func: BgioMoveFunction<State, Param>): BgioMoveFunction<State, Param> {
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
                moveError: errorMessage, // Not strictly necessary
                moveCount: G.moveCount+1,
            };
        } else {
            G.moveCount++;
            G.moveError = errorMessage;
        }
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BgioMoveFunctions<S extends RequiredState> = {[key: string]: BgioMoveFunction<S, any>};

export function wrapMoveFunctions<S extends RequiredState>(
    unwrapped: BgioMoveFunctions<S>
) 
    : BgioMoveFunctions<S> {
    const obj : BgioMoveFunctions<S> = {};
    
    for (const [key, value] of Object.entries(unwrapped)) {
        obj[key] = wrapMoveFunction(value);
    }

    return obj;
}

export type ClientMoveFunctions<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Functions extends { [key: string]: BgioMoveFunction<any,any> } 
> = {
    [Name in keyof Functions]: (arg: Parameters<Functions[Name]>[2]) => void;
};