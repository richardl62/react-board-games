import { RequiredServerData } from "./required-server-data";
import { MoveArg0 } from "./bgio-types";

type BgioMoveFunction<State, Param> = (arg0: MoveArg0<State>, param: Param) => void | State;

export function wrapMoveFunction<State extends RequiredServerData, Param>(func: BgioMoveFunction<State, Param>): BgioMoveFunction<State, Param> {
    return (arg0, param) => {
        let errorMessage = null;
        let funcResult = undefined;
        try {
            funcResult = func(arg0, param);
        } catch (error) {
            errorMessage = error instanceof Error ? error.message :
                "unknown error";
        }

        const { G } = arg0;
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
    functions extends { [key: string]: BgioMoveFunction<any, any>; }
> = {
        [Name in keyof functions]: (arg: Parameters<functions[Name]>[1]) => void;
    };
