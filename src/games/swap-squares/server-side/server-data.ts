import { Ctx } from "boardgame.io";
import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { SetupOptions } from "../options";

enum StartingOrder {
    forward,
    backwards,
    random,
}

export interface ServerData extends RequiredServerData {
    squares: number[];
    options: SetupOptions;
    startingOrder: StartingOrder;
}

export function setSquares(G: ServerData, ctx: Ctx) : void {
    
    const makeSquares = () => {
        const nSquares = G.options.numRows * G.options.numColumns;


        const squares: number[] = [];
        for (let i = 0; i < nSquares; i++) {
            squares.push(i);
        }

        switch (G.startingOrder) {
        case StartingOrder.forward:
            return squares;
        case StartingOrder.backwards:
            return squares.reverse();
        case StartingOrder.random:
            return ctx.random!.Shuffle(squares);
        }
    };

    G.squares = makeSquares();
}

export function startingServerData(ctx: Ctx, options: SetupOptions): ServerData {
    const G = {
        squares: [],
        options,
        startingOrder: StartingOrder.random,
        ...startingRequiredState(),
    };

    setSquares(G, ctx);

    return G;
}





