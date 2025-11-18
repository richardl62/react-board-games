import { RequiredServerData } from "../required-server-data.js";
import { BgioMoveFunction, BgioMoveFunctions } from "../move-fn.js";

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



export function wrapMoveFunctions<S extends RequiredServerData>(
    unwrapped: BgioMoveFunctions<S>
): BgioMoveFunctions<S> {
    const obj: BgioMoveFunctions<S> = {};

    for (const [key, value] of Object.entries(unwrapped)) {
        obj[key] = wrapMoveFunction(value);
    }

    return obj;
}

