import { SquareID } from "../../boards";
import { nestedArrayMap, shuffle } from "../../shared/tools";
import { fullBag, Letter } from "./letter-properties";
import { squareTypesArray, rackSize } from "./board-properties";
import assert from "../../shared/assert";

export interface TileData {
    letter: Letter;
    /** movable in the current turn.  Rack tiles are always active. */
    active: boolean;
}

export function getLetter(sd : TileData | null) : Letter | null {
    return sd && sd.letter;
}

export type BoardData = (TileData | null)[][];

export interface PlayerData {
    rack: (Letter | null)[];
    score: number;
}

export interface GameData {
    board: BoardData;
    playerData: PlayerData[]; 
    bag: Letter[];

    // To help with click-moves
    moveStart: SquareID | null;
}

export function startingGameData(): GameData {
    let bag = shuffle([...fullBag]); 
    assert(bag.length > rackSize);

    const rack = () => {
        let letters : Letter[] = [];
        for (let i = 0; i < rackSize; ++i) {
            letters.push(bag.pop()!);
        }

        return letters;
    }

    return {
        board: nestedArrayMap(squareTypesArray, () => null),
        playerData: [
            {rack: rack(),
             score: 0
            }
        ],
        moveStart: null,
        bag: bag,
    };
}
