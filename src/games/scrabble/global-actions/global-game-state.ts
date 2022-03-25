import { sAssert } from "../../../utils/assert";
import { nestedArrayMap } from "../../../utils/nested-array-map";
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
interface GameState {
    board: BoardData;
    playerData: PlayerDataDictionary; 
    bag: Letter[];

    moveHistory: MoveHistoryElement[];

    // More than one Id implies there was a draw.
    winnerIds: string[] | null;
}

/** Data recorded and shared via BGIO */
export interface GlobalGameState {
    state: GameState;

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

export function isGameState(arg: unknown) : boolean {
    const state = arg as GameState;
    return typeof state === "object" && 
        typeof state.board === "object" &&
        typeof state.playerData === "object" &&
        typeof state.bag === "object" &&
        isPlayerDataDictionary(state.playerData);
}

/** Quick check that an object is (probably) a GameData. */
export function isGlobalGameState(arg: unknown) : boolean {
    const globalState = arg as GlobalGameState;
    return isGameState(globalState.state) &&
        typeof globalState.timestamp === "number";
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
        state: {
            board: nestedArrayMap(config.boardLayout, () => null),
            playerData: playerData,
            bag: bag,

            moveHistory: initialMoveHistory,
            winnerIds: null,
        },

        timestamp: 0,
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

