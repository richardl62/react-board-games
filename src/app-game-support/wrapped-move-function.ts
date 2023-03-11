import { Ctx } from "boardgame.io";
import { RequiredServerData } from "./required-server-data";

type BgioMoveFunction<State, Param> = (state: State, ctx: Ctx, param: Param) => void | State;

export function wrapMoveFunction<State extends RequiredServerData, Param>(func: BgioMoveFunction<State, Param>): BgioMoveFunction<State, Param> {
    return (G, ctx, param) => {
        let errorMessage = null;
        let funcResult = undefined;
        try {
            funcResult = func(G, ctx, param);
        } catch (error) {
            errorMessage = error instanceof Error ? error.message :
                "unknown error";
        }

        if (funcResult) {
            return {
                ...funcResult,
                moveError: errorMessage,
                moveCount: G.moveCount + 1,
            };
        } else {
            G.moveCount++;
            G.moveError = errorMessage;
        }
    };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BgioMoveFunctions<S extends RequiredServerData> = { [key: string]: BgioMoveFunction<S, any>; };

export function wrapMoveFunctions<S extends RequiredServerData>(
    unwrapped: BgioMoveFunctions<S>
): BgioMoveFunctions<S> {
    const obj: BgioMoveFunctions<S> = {};

    for (const [key, value] of Object.entries(unwrapped)) {
        obj[key] = wrapMoveFunction(value);
    }

    return obj;
}

export type ClientMoveFunctions<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Functions extends { [key: string]: BgioMoveFunction<any, any>; }
> = {
        [Name in keyof Functions]: (arg: Parameters<Functions[Name]>[2]) => void;
    };
