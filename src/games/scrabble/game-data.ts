import { Ctx } from "boardgame.io";
import { SquareID } from "../../boards";
import assert from "../../shared/assert";
import { nestedArrayMap, shuffle } from "../../shared/tools";
import { rackSize, squareTypesArray } from "./board-properties";
import { fullBag, Letter } from "./letter-properties";

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
    name: string;
    rack: (Letter | null)[];
    score: number;
}

export interface GameData {
    board: BoardData;
    playerData: PlayerData[]; 
    currentPlayer: number;
    bag: Letter[];

    // To help with click-moves
    moveStart: SquareID | null;
}

export function startingGameData(ctx: Ctx): GameData {
    let bag = shuffle([...fullBag]); 
    assert(bag.length > rackSize);

    const rack = () => {
        let letters : Letter[] = [];
        for (let i = 0; i < rackSize; ++i) {
            letters.push(bag.pop()!);
        }

        return letters;
    }

    let playerData : PlayerData[] = [];
    for(let p = 0; p < ctx.numPlayers; ++p) {
        playerData.push({
            name: `Player ${p+1}`,
            rack: rack(),
            score: 0,
        });
    }
    return {
        board: nestedArrayMap(squareTypesArray, () => null),
        playerData: playerData,
        currentPlayer: 0,
        bag: bag,
        moveStart: null,
    };
}
