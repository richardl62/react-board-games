import { sAssert } from "../../../shared/assert";
import { nestedArrayMap } from "../../../shared/tools";
import { ScrabbleConfig } from "../config";
import { Letter } from "../config";
import { CoreTile, makeCoreTile } from "./core-tile";

export interface TileData extends CoreTile {

    /** movable in the current turn.  Rack tiles are always active. */
    active: boolean;
}

export function getLetter(sd : TileData | null) : Letter | null {
    return sd && sd.letter;
}

export type BoardData = (TileData | null)[][];

export interface GamePlayerData {
    rack: (CoreTile|null)[];
    score: number;
}

type PlayerDataDictionary = {[id: string] : GamePlayerData};

/** Data recorded and shared via BGIO */
export interface GlobalGameState {
    board: BoardData;
    playerData: PlayerDataDictionary; 
    bag: Letter[];
    turn: number;

    /** Any move that changes game data will also increase timestamp */
    timestamp: number;
}

/** Quick check that an object is (probably) a GameData. */
export function isGlobalGameState(arg: unknown) : boolean {
    const gd = arg as GlobalGameState;
    return typeof gd === "object" && 
        typeof gd.board === "object" &&
        typeof gd.playerData === "object" &&
        typeof gd.bag === "object" &&
        typeof gd.turn === "number" &&
        typeof gd.timestamp === "number";
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
            rack: rack().map(makeCoreTile),
            score: 0,
        };
    }
    
    return {
        board: nestedArrayMap(config.boardLayout, () => null),
        playerData: playerData,
        bag: bag,
        turn: 0,
        timestamp: 0,
    };
}
