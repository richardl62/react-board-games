export interface RequiredServerData  {
    /** Description of the exception, if any, thrown during the last move.
     *  Set in wrapMoveFunction.
     */
    moveError: string | null;

    /** Count of moves. Set in wrapMoveFunction. */
    moveCount: number;
}

export const startingRequiredState : RequiredServerData = {
    moveError: null,
    moveCount: 0,
};