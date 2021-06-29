import { SquareID } from "../../boards";
import { nestedArrayMap, shuffle } from "../../shared/tools";
import { fullBag, Letter } from "./letter-properties";
import { squareTypesArray, rackSize } from "./board-properties";

export interface GameData {
    board: (Letter | null)[][];
    racks: (Letter | null)[][];
    moveStart: SquareID | null;
    bag: Letter[];
}

export function startingGameData(): GameData {
    const rack = Array<Letter | null>(rackSize);
    rack.fill(null);

    return {
        board: nestedArrayMap(squareTypesArray, () => null),
        racks: [
            rack,
        ],
        moveStart: null,
        bag: shuffle([...fullBag]),
    };
}
