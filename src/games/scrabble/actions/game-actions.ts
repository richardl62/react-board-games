import { sAssert } from "../../../shared/assert";
import { GlobalGameState, BoardData } from "./global-game-state";
import { RowCol } from "./get-words-and-score";
import { CoreTile } from "./core-tile";
import { blank } from "../config";
import { Rack } from "./board-and-rack";

export interface SquareID {
    row: number;
    col: number;
    boardID: string;
}

export const boardIDs = {
    rack: "rack",
    main: "main",
};

function sanityCheck(sq: SquareID ) {
    if(sq.boardID === boardIDs.main) {
        return true;
    }

    if(sq.boardID === boardIDs.rack) {
        return sq.row === 0;
    }

    return false;
}

export function onRack(sq: SquareID | null): boolean {
    if(!sq) {
        return false;
    } 
    sAssert(sanityCheck(sq));

    return sq.boardID === boardIDs.rack;
}

export function getWord(
    board: BoardData,

    /** must refer to non-empty board positions */
    positions: RowCol[]
) : string 

{
    const letters = positions.map(rc => {
        const sq = board[rc.row][rc.col];
        sAssert(sq);
        return sq.letter;
    });

    return "".concat(...letters);
}



export function addToRack(rack: Rack, tile: CoreTile): void {
    const emptyIndex = rack.findIndex(t => t === null);
    sAssert(emptyIndex >= 0, "Attempt to add to full rack");

    // Black tiles lose any user defined value when returned to the rack.
    rack[emptyIndex] = tile.isBlank ? blank : tile.letter; 
}

/* move blank spaces to the end */
export function compactRack(rack: Rack): void {
    let setPos = 0;
    for(let readPos = 0; readPos < rack.length; ++readPos) {
        if(rack[readPos]) {
            rack[setPos] = rack[readPos];
            ++setPos;  
        }
    }
    for(; setPos < rack.length; ++setPos) {
        rack[setPos] = null;
    }
}

export function canSwapTiles(G: GlobalGameState): boolean {
    const rackSize = Object.values(G.playerData)[0].rack.length;
    return G.bag.length >= rackSize;
}
