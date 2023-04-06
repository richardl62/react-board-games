import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { SetupOptions } from "../options";
import { shuffle } from "../../../utils/shuffle";

export const startingOrders = [
    "forward",
    "backwards",
    "random",
] as const;

export interface ServerData extends RequiredServerData {
    squares: number[];
    options: SetupOptions;
}

export function setSquares(
    G: ServerData, 
    // Return a shuffled copy of the input array. Can shuffle in place.
    shuffle: (array: number[]) => number[]
) : void {
    
    const makeSquares = () => {
        const nSquares = G.options.numRows * G.options.numColumns;

        const squares: number[] = [];
        for (let i = 0; i < nSquares; i++) {
            squares.push(i);
        }

        switch (G.options.startingOrder) {
        case "forward":
            return squares;
        case "backwards":
            return squares.reverse();
        case "random":
            return shuffle(squares);
        }
    };

    G.squares = makeSquares();
}

export function startingServerData(_arg0: unknown, options: SetupOptions): ServerData {
    const G : ServerData = {
        squares: [],
        options,
        ...startingRequiredState(),
    };

    setSquares(G, shuffle);

    return G;
}






