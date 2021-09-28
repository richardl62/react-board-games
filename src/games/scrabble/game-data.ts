import { Ctx } from "boardgame.io";
import { sAssert } from "shared/assert";
import { nestedArrayMap } from "shared/tools";
import { ScrabbleConfig } from "./scrabble-config";
import { Letter } from "./letters";
import { CoreTile } from "./core-tile";

export interface TileData extends CoreTile {

    /** movable in the current turn.  Rack tiles are always active. */
    active: boolean;
}

export function getLetter(sd : TileData | null) : Letter | null {
    return sd && sd.letter;
}

export type BoardData = (TileData | null)[][];

export interface GamePlayerData {
    /**
     * playable tiles are those either on the rack or that have been moved
     * off the rack onto the board, but are still available for moving (i.e
     * have not yet been permanently added as part of the turn.)
     */
    playableTiles: (CoreTile|null)[];
    score: number;
}

type PlayerDataDictionary = {[id: string] : GamePlayerData};

export interface GameData {
    board: BoardData;
    playerData: PlayerDataDictionary; 
    bag: CoreTile[];
    turn: number;
}


export function startingGameData(ctx: Ctx, config: ScrabbleConfig): GameData {
    const bag = config.makeFullBag(); 

    const rack = () => {
        const tiles : CoreTile[] = [];
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
            playableTiles: rack(),
            score: 0,
        };
    }
    
    return {
        board: nestedArrayMap(config.boardLayout, () => null),
        playerData: playerData,
        bag: bag,
        turn: 0,
    };
}
