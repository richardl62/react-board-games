export interface RequiredServerData  {
    /** Description of the exception, if any, thrown during the last move.
     *  Set in wrapMoveFunction.
     */
    moveError: string | null;

    /** Count of moves. Set in wrapMoveFunction. */
    moveCount: number;
}

/** Return 'arg as RequiredServerData' if arg appears to be a RequiredServerData 
 * (including or extented types). Return null if arg is not a required state.
*/
export function asRequiredServerData(arg: unknown) : RequiredServerData | null {
    const state = arg as RequiredServerData;
    
    const ok = typeof state === "object" &&
        (typeof state.moveCount === "number" || state.moveError === null) &&
        typeof state.moveCount === "number";
    
    return ok ? state : null;
}

export const startingRequiredState : RequiredServerData = {
    moveError: null,
    moveCount: 0,
};