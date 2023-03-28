import { Ctx } from "boardgame.io";
import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { SetupOptions } from "../options";

export const startingOrders = [
    "forward",
    "backwards",
    "random",
] as const;

export interface ServerData extends RequiredServerData {
    squares: number[];
    options: SetupOptions;
}

export function setSquares(G: ServerData, ctx: Ctx) : void {
    
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
            return ctx.random!.Shuffle(squares);
        }
    };

    G.squares = makeSquares();
}

export function startingServerData(ctx: Ctx, options: SetupOptions): ServerData {
    const G : ServerData = {
        squares: [],
        options,
        ...startingRequiredState(),
    };

    setSquares(G, ctx);

    return G;
}






