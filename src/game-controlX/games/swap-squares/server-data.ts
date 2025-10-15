import { RequiredServerData, startingRequiredState } from "@/game-controlX/required-server-data";
import { SetupArg0 } from "@/game-controlX/game-control";
import { RandomAPI } from "@/game-controlX/random-api";

export const startingOrders = [
    "forward",
    "backwards",
    "random",
] as const;

export interface SetupOptions {
    readonly numRows: number,
    readonly numColumns: number,
    readonly startingOrder: typeof startingOrders[number],
}

export interface ServerData extends RequiredServerData {
    squares: number[];
    options: SetupOptions;
}

export function setSquares(
    G: ServerData, 
    random: RandomAPI
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
            return random.Shuffle(squares);
        }
    };

    G.squares = makeSquares();
}

export function startingServerData({random}: SetupArg0, options: SetupOptions): ServerData {
    const G : ServerData = {
        squares: [],
        options,
        ...startingRequiredState(),
    };

    setSquares(G, random);

    return G;
}






