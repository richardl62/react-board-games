import { Ctx } from "boardgame.io";
import { RequiredServerData, startingRequiredState } from "../../../app-game-support/required-server-data";
import { SetupOptions } from "../options";

export interface ServerData extends RequiredServerData {
    squares: number[];
    options: SetupOptions;
}

export function setSquares(G: ServerData) : void {
    const nSquares = G.options.numRows * G.options.numColumns;
    
    G.squares = [];
    for(let i = 0; i < nSquares; i++) {
        G.squares.push(i);
    }
}

export function startingServerData(_ctx: Ctx, options: SetupOptions): ServerData {
    const G = {
        squares: [],
        options,
        ...startingRequiredState(),
    };

    setSquares(G);

    return G;
}





