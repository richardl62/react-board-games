import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";

export interface ServerData extends RequiredServerData {
    squares: number[];
}

export const initialSquares = [
    1, 2, 3,
    4, 5, 6,
    7, 8, 9,
];

export function startingServerData(): ServerData {
    return {
        squares: initialSquares,
        
        ...startingRequiredState(),
    };
}

Object.freeze(initialSquares);




