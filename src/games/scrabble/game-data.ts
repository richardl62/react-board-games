import { Ctx } from "boardgame.io";
import { SquareID } from "../../boards";
import { gAssert } from "../../shared/assert";
import { nestedArrayMap, shuffle } from "../../shared/tools";
import { scrabbleConfig, Letter, ScrabbleConfig } from "./scrabble-config";

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

function makeBag({letterDistribution}: ScrabbleConfig): Letter[] {

    let bag: Array<Letter> = [];
    for (const letter_ in letterDistribution) {
        const letter = letter_ as Letter; // KLUDGE? - why does TS need this?
        const count = letterDistribution[letter];
        for (let i = 0; i < count; ++i) {
            bag.push(letter);
        }
    }

    return shuffle(bag);
}

export function startingGameData(ctx: Ctx): GameData {
    let bag = makeBag(scrabbleConfig()); 

    const rack = () => {
        let letters : Letter[] = [];
        for (let i = 0; i < scrabbleConfig().rackSize; ++i) {
            const letter = bag.pop();
            gAssert(letter, "Too few letters for initial setup");
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
        board: nestedArrayMap(scrabbleConfig().boardLayout, () => null),
        playerData: playerData,
        bag: bag,
        moveStart: null,
    };
}
