import { Ctx } from "boardgame.io";
import { SquareID } from "../../boards";
import { gAssert } from "../../shared/assert";
import { nestedArrayMap, shuffle } from "../../shared/tools";
import { rackSize, squareTypesArray } from "./scrabble-config";
import { fullBag, Letter } from "./scrabble-config";

export interface TileData {
    letter: Letter;
    /** movable in the current turn.  Rack tiles are always active. */
    active: boolean;
}

export function getLetter(sd : TileData | null) : Letter | null {
    return sd && sd.letter;
}

export type BoardData = (TileData | null)[][];

export type Rack = (Letter | null)[];

export interface PlayerData {
    rack: Rack;
    score: number;
}

type PlayerDataDictionary = {[id: string] : PlayerData};

export interface GameData {
    board: BoardData;
    playerData: PlayerDataDictionary; 
    bag: Letter[];

    // To help with click-moves
    moveStart: SquareID | null;
}

export function startingGameData(ctx: Ctx): GameData {
    let bag = shuffle([...fullBag]); 
    gAssert(bag.length > rackSize);

    const rack = () => {
        let letters : Letter[] = [];
        for (let i = 0; i < rackSize; ++i) {
            letters.push(bag.pop()!);
        }

        return letters;
    }


    let playerData: PlayerDataDictionary = {};
    for (let p = 0; p < ctx.numPlayers; ++p) {
        const playerID = p.toString(); //Kludge?
        playerData[playerID] = {
            rack: rack(),
            score: 0,
        };
    }
    

    return {
        board: nestedArrayMap(squareTypesArray, () => null),
        playerData: playerData,
        bag: bag,
        moveStart: null,
    };
}
