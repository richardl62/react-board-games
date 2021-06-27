import { SquareID } from "../../boards";
import assert from "../../shared/assert";
import { nestedArrayMap, sameJSON } from "../../shared/tools";
import { Letter, squareTypesArray } from "./game-properties";

export interface GameData {
    board: (Letter | null)[][],
    racks: (Letter | null)[][],
    moveStart: SquareID | null,
}

export function startingGameData() : GameData {
    return {
        board: nestedArrayMap(squareTypesArray, () => null), // KLUDGE?
        racks:[
            ['L', 'M', 'N', 'O', 'P', 'E', '?'],
        ],
        moveStart: null,
    }
}

export const moves = {
    start: (G: GameData, ctx: any, sq: SquareID) => {
        G.moveStart = sq;
    },

    end: (G: GameData, ctx: any, from: SquareID, to: SquareID | null) => {
        assert(sameJSON(G.moveStart, from));

        console.log("Move: ", from, to);
    },
};