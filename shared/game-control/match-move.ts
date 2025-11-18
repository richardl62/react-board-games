import { RequiredServerData } from "./required-server-data.js";
import { MoveFn, MoveArg0 } from "./move-fn.js";

/**
 * Call a Game's move function in a manner that is suitable for a match.
 * Specifically, catch errors and increment the move count.
 */
export function matchMove<State extends RequiredServerData, Param>(
    func: MoveFn<State>,
    arg0: MoveArg0<State>, 
    param: Param
) : State | undefined {
    let errorMessage = null;
    let funcResult = undefined;

    const { G } = arg0;
    try {
        funcResult = func(arg0, param);
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
}


