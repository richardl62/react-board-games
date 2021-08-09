import { Ctx } from "boardgame.io";
import { sAssert } from "../../shared/assert";
import { nestedArrayMap } from "../../shared/tools";
import { Letter, ScrabbleConfig } from "./scrabble-config";

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

export interface GamePlayerData {
    rack: Rack;
    score: number;
}

type PlayerDataDictionary = {[id: string] : GamePlayerData};

export interface GameData {
    board: BoardData;
    playerData: PlayerDataDictionary; 
    bag: Letter[];
}


export function startingGameData(ctx: Ctx, config: ScrabbleConfig): GameData {
    let bag = config.makeFullBag(); 

    const rack = () => {
        let letters : Letter[] = [];
        for (let i = 0; i < config.rackSize; ++i) {
            const letter = bag.pop();
            sAssert(letter, "Too few letters for initial setup");
            letters.push(letter);
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
        board: nestedArrayMap(config.boardLayout, () => null),
        playerData: playerData,
        bag: bag,
    };
}
