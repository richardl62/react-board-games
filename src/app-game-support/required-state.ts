export interface RequiredState  {
    /** Description of the exception, if any, thrown during the last move.
     *  Set in wrapMoveFunction.
     */
    moveError: string | null;

    /** Count of moves. Set in wrapMoveFunction. */
    moveCount: number;
}

/** Return 'arg as RequiredState' if arg is a required state (including extensions)
 * Return null if arg is not a required state.
*/
export function asRequiredState(arg: unknown) : RequiredState | null {
    const state = arg as RequiredState;
    
    const ok = typeof state === "object" &&
        (typeof state.moveCount === "number" || state.moveError === null) &&
        typeof state.moveCount === "number";
    
    return ok ? state : null;
}

export const startingRequiredState : RequiredState = {
    moveError: null,
    moveCount: 0,
};