export interface RequiredServerData  {
    /** Count of moves. Set in wrapMoveFunction. */
    moveCount: number;
}

export function isRequiredServerData(obj: unknown): obj is RequiredServerData {
    if (typeof obj !== "object" || obj === null)
        return false;

    const candidate = obj as RequiredServerData;

    return  typeof candidate.moveCount === "number";
}

export function startingRequiredState() : RequiredServerData {
    return {
        moveCount: 0,
    };
}