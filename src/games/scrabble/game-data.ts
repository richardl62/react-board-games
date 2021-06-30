import { SquareID } from "../../boards";
import { nestedArrayMap, shuffle } from "../../shared/tools";
import { fullBag, Letter } from "./letter-properties";
import { squareTypesArray, rackSize } from "./board-properties";
import assert from "../../shared/assert";

export interface GameData {
    board: (Letter | null)[][];
    racks: (Letter | null)[][];
    moveStart: SquareID | null;
    bag: Letter[];
}

export function startingGameData(): GameData {
    let bag = shuffle([...fullBag]); 
    assert(bag.length > rackSize);

    const rack : Letter[] = [];
    for(let i = 0; i < rackSize; ++i) {
        rack.push(bag.pop()!);
    }

    return {
        board: nestedArrayMap(squareTypesArray, () => null),
        racks: [
            rack,
        ],
        moveStart: null,
        bag: bag,
    };
}