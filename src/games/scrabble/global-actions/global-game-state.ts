import { sAssert } from "../../../utils/assert";
import { nestedArrayMap } from "../../../utils/tools";
import { ScrabbleConfig } from "../config";
import { Letter } from "../config";
import { ExtendedLetter } from "../local-actions/extended-letter";
import { MoveHistoryElement } from "./move-hstory";

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

/** Data recorded and shared via BGIO */
export interface GlobalGameState {
    board: BoardData;
    playerData: PlayerDataDictionary; 
    bag: Letter[];

    moveHistory: MoveHistoryElement[];

    // More than one Id implies there was a draw.
    winnerIds: string[] | null;

    /** Any move that changes game data will also increase timestamp */
    timestamp: number;

    serverError: string | null;
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
        timestamp: 0,
        winnerIds: null,

        moveHistory: initialMoveHistory,

        serverError: null,
    };
}

const initialMoveHistory : MoveHistoryElement[] = [
    // {
    //     name: "Richard",
    //     words: ["fudge"],
    //     illegalWords: [],
    //     score: 20,

    // },
    // {
    //     name: "Other",
    //     words: ["toffee", "xyz"],
    //     illegalWords: ["xyz"],
    //     score: 45,
    // },
    // {
    //     name: "Richard",
    //     pass: true,
    // },
    // {
    //     name: "Other",
    //     swapTiles: true,
    // }
];

