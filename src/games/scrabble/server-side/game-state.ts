import { sAssert } from "../../../utils/assert";
import { nestedArrayMap } from "../../../utils/nested-array-map";
import { ScrabbleConfig } from "../config";
import { Letter } from "../config";
import { ExtendedLetter } from "../client-side/extended-letter";
import { MoveHistoryElement } from "./move-hstory";
import { SetupArg0 } from "../../../app-game-support/bgio-types";

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

/** The state of the game at a particular point in history */
export interface GameState {
    board: BoardData;
    playerData: PlayerDataDictionary; 
    bag: Letter[];

    currentPlayer: string,

    moveHistory: MoveHistoryElement[];

    // More than one Id implies there was a draw.
    winnerIds: string[] | null;
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

export function startingGameState({ctx, random}: SetupArg0, config: ScrabbleConfig): GameState {
    const bag = config.makeFullBag(random); 

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

        currentPlayer: ctx.currentPlayer,

        moveHistory: [],
        winnerIds: null,
    };
}


