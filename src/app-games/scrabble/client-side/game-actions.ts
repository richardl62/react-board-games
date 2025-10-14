import { sAssert } from "../../../utils/assert";
import { blank } from "../config";

import { Rack } from "./board-and-rack";
import { ExtendedLetter } from "./extended-letter";
import { RowCol } from "./get-words-and-score";
import { BoardData } from "../server-side/game-state";
import { ServerData } from "../server-side/server-data";

export interface SquareID {
    row: number;
    col: number;
    boardID: string;
}

export function sameSquareID(sid1: SquareID, sid2: SquareID) : boolean {
    return sid1.row === sid2.row &&
        sid1.col === sid2.col &&
        sid1.boardID === sid2.boardID;
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



export function addToRack(rack: Rack, tile: ExtendedLetter): void {
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

export function canSwapTiles(G: ServerData): boolean {
    const state = G.states[G.states.length-1];
    const rackSize = Object.values(state.playerData)[0].rack.length;
    return state.bag.length >= rackSize;
}
