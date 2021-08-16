import { SquareID } from "../../boards";
import { sAssert } from "../../shared/assert";
import { Letter } from "./scrabble-config";
import { GameData, BoardData } from "./game-data";
import { RowCol } from "./find-candidate-words";

type Rack = (Letter|null)[];
export const boardIDs = {
    rack: 'rack',
    main: 'main',
}

export function onRack(sq: SquareID | null): boolean {
    if(sq && sq.boardID === boardIDs.rack) {
        sAssert(sq.row === 0); 
        return true;
    } 
    return false;
}

/** 
* Report whether there are active tiles on the board.
* 
* Active tiles are those taken from the rack. 
*
* Note: For most of the game this is equivalent to checking if the rank has 
* gaps. But difference can occur at the end of the game when the bag is emtpy.
*/
export function tilesOut(board: BoardData) : boolean {
    return !!board.find(row => row.find(sq=>sq?.active));
}

export function getWord(
    board: BoardData,

    /** must refer to non-empty board positions */
    positions: RowCol[]
    ) : string 

    {
    let letters = positions.map(rc => {
        const sq = board[rc.row][rc.col];
        sAssert(sq);
        return sq.letter;
    });

    return "".concat(...letters);
}



export function addToRack(rack: Rack, l: Letter) {
    let emptyIndex = rack.findIndex(l => l === null);
    sAssert(emptyIndex >= 0, "Attempt to add to full rack");
    rack[emptyIndex] = l;
}

/* move blank spaces to the end */
export function compactRack(rack: Rack) {
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

export function canSwapTiles(G: GameData) {
    const rackSize = Object.values(G.playerData)[0].playableTiles.length;
    return G.bag.length >= rackSize;
}