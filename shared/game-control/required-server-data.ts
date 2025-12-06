export interface RequiredServerData  {
    /** Description of the exception, if any, thrown during the last move.
     *  Set in wrapMoveFunction.
     */
    moveError: string | null;

    /** Count of moves. Set in wrapMoveFunction. */
    moveCount: number;

    // Date at which startingRequiredState() is called
    startDate: number;
}

export function isRequiredServerData(obj: unknown): obj is RequiredServerData {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as RequiredServerData;

    return (candidate.moveError === null || typeof candidate.moveError === "string") &&
        typeof candidate.moveCount === "number" &&
        typeof candidate.startDate === "number";
}

export function startingRequiredState() : RequiredServerData {
    return {
        moveError: null,
        moveCount: 0,
        startDate: Date.now(),
    };
}