export interface ServerData {
  squares: number[];
  moveError: null;
}

export const initialSquares = [
    1, 2, 3,
    4, 5, 6,
    7, 8, 9,
];

export function startingServerData(): ServerData {
    return {
        squares: initialSquares,
        moveError: null,
    };
}

Object.freeze(initialSquares);




