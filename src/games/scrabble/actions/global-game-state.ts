import { sAssert } from "../../../shared/assert";
import { nestedArrayMap } from "../../../shared/tools";
import { ScrabbleConfig } from "../config";
import { Letter } from "../config";
import { ExtendedLetter } from "./extended-letter";

export interface BoardSquareData extends ExtendedLetter {

    /** movable in the current turn.  Rack tiles are always active. */
    active: boolean;
}

export function getLetter(sd : BoardSquareData | null) : Letter | null {
    return sd && sd.letter;
}

export type BoardData = (BoardSquareData | null)[][];

export interface GamePlayerData {
    rack: (Letter|null)[];
    score: number;
}

type PlayerDataDictionary = {[id: string] : GamePlayerData};

export interface MoveHistoryElement {
    name: string;
    
    pass?: true;
    swapTiles?: true;

    word?: string;
    score?: number;
    inWordList?: boolean;
}



/** Data recorded and shared via BGIO */
export interface GlobalGameState {
    board: BoardData;
    playerData: PlayerDataDictionary; 
    bag: Letter[];
    turn: number;

    moveHistory: MoveHistoryElement[];

    /** Any move that changes game data will also increase timestamp */
    timestamp: number;
}

function isPlayerData(playerData: GamePlayerData) {
    return Array.isArray(playerData.rack) &&
        typeof playerData.score === "number";
}

function isPlayerDataDictionary(playerDataDict: PlayerDataDictionary) {
    for (const pid in playerDataDict) {
        if( isNaN(parseInt(pid)) ){
            console.warn(`In PlayerData, pid "${pid}" is not an integer`);
        }
        if( !isPlayerData(playerDataDict[pid]) ) {
            return false;
        }
    }
    return true;
}

/** Quick check that an object is (probably) a GameData. */
export function isGlobalGameState(arg: unknown) : boolean {
    const gd = arg as GlobalGameState;
    return typeof gd === "object" && 
        typeof gd.board === "object" &&
        typeof gd.playerData === "object" &&
        typeof gd.bag === "object" &&
        typeof gd.turn === "number" &&
        typeof gd.timestamp === "number" &&
        isPlayerDataDictionary(gd.playerData);
}

export function startingGlobalGameState(numPlayers: number, config: ScrabbleConfig): GlobalGameState {
    const bag = config.makeFullBag(); 

    const rack = () => {
        const tiles : Letter[] = [];
        for (let i = 0; i < config.rackSize; ++i) {
            const tile = bag.pop();
            sAssert(tile, "Too few tiles for initial setup");
            tiles.push(tile);
        }

        return tiles;
    };

    const playerData: PlayerDataDictionary = {};
    for (let p = 0; p < numPlayers; ++p) {
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
        turn: 0,
        timestamp: 0,

        moveHistory: dummyMoveHistory(),
    };
}
function dummyMoveHistory(): MoveHistoryElement[] {
    return [
        {
            name: "Richard",
            word: "fred",
            score: 20,
            inWordList: true,
        },
        {
            name: "Other",
            word: "xyz",
            score: 45,
            inWordList: false,
        },
        {
            name: "Richard",
            pass: true,
        },
        {
            name: "Other",
            swapTiles: true,
        }
    ];
}

