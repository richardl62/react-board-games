import { SquareID } from "../../boards";
import { sAssert } from "../../shared/assert";
import { Letter } from "./scrabble-config";
import { TileData, GameData, BoardData } from "./game-data";
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

function rackPos(sq: SquareID): number {
    sAssert(onRack(sq)) ;
    return sq.col;
}

/** get the letter at a square */
export function getSquareData(G: GameData, rack: Rack, sq: SquareID) : TileData | null {
    if(onRack(sq)) {
        const letter = rack[rackPos(sq)];
        return letter && {
            letter: letter,
            active: true, // rank letters are always active
        }
    } else {
        return G.board[sq.row][sq.col];
    }
}

function makeRackGap(rack: (Letter|null)[], pos: number) {
    const nullPos = rack.findIndex(l => l === null);
    sAssert(nullPos >= 0, "makeRackGap did not find an empty square");
    if(nullPos < pos) {
        for(let ind = nullPos; ind < pos; ++ind) {
            rack[ind] = rack[ind+1];
        }
    } else {
        for(let ind = nullPos; ind > pos; --ind) {
            rack[ind] = rack[ind-1];
        }
    }
    rack[pos] = null;
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

/** Draw letters from bag to replace null tiles in rack 
 * Existing rack is compacted first.
*/
export function fillRack(G: GameData, rack: Rack) {
    compactRack(rack);
    
    let bag = G.bag;
    for(let i = 0; i < rack.length; ++i) {
        if(rack[i] === null && bag.length > 0) {
            rack[i] = bag.pop()!;
        }
    }
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

export enum RackAction {
    insert,
    overwrite,
}

/** Set a square to a given value */
export function setLetter(
    G: GameData, 
    rack: Rack,
    sq: SquareID, 
    letter: Letter | null, 
    rackAction : RackAction = RackAction.overwrite,  
    ) {
    if(onRack(sq)) {
        const pos = rackPos(sq);
        if(rackAction === RackAction.insert) {
            makeRackGap(rack, pos);
        }
        rack[pos] = letter;
    } else {
        let row = [...G.board[sq.row]];
        row[sq.col] = letter && {letter:letter, active: true};
        G.board[sq.row] = row; 
    }
}

export function canSwapTiles(G: GameData) {
    const rankSize = Object.values(G.playerData)[0].playableTiles.length;
    return G.bag.length >= rankSize;
}