import { DragType, MoveFunctions, SquareID } from "../../boards";
import assert from "../../shared/assert";
import { BoardProps } from "../../shared/types";
import { Letter } from "./letter-properties";
import { TileData, GameData, BoardData } from "./game-data";
import { RowCol } from "./find-candidate-words";
import { ClientMoves } from "./bgio-moves";

export const boardIDs = {
    rack: 'rack',
    main: 'main',
}

export function onRack(sq: SquareID | null): boolean {
    if(sq && sq.boardID === boardIDs.rack) {
        assert(sq.row === 0); 
        return true;
    } 
    return false;
}

function rackPos(sq: SquareID): number {
    assert(onRack(sq)) ;
    return sq.col;
}

/** get the letter at a square */
export function getSquareData(G: GameData, sq: SquareID) : TileData | null {
    if(onRack(sq)) {
        const letter = G.playerData[G.currentPlayerKLUDGE].rack[rackPos(sq)];
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
    assert(nullPos >= 0, "makeRackGap did not find an empty square");
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
export function tilesOut(gameData: GameData) : boolean {
    return !!gameData.board.find(row => row.find(sq=>sq?.active));
}

export function getWord(
    board: BoardData,

    /** must refer to non-empty board positions */
    positions: RowCol[]
    ) : string 

    {
    let letters = positions.map(rc => {
        const sq = board[rc.row][rc.col];
        assert(sq);
        return sq.letter;
    });

    return "".concat(...letters);
}

/** Draw letters from bag to replace null tiles in rack 
 * Existing rack is compacted first.
*/
export function fillRack(G: GameData) {
    compactRack(G);

    let rack = G.playerData[G.currentPlayerKLUDGE].rack;
    let bag = G.bag;
    for(let i = 0; i < rack.length; ++i) {
        if(rack[i] === null && bag.length > 0) {
            rack[i] = bag.pop()!;
        }
    }
}


export function recallRack(G: GameData) {
    for (let row = 0; row < G.board.length; ++row) {
        for (let col = 0; col < G.board[row].length; ++col) {
            let sq = G.board[row][col];
            if (sq?.active) {
                addToRack(G, sq.letter);
                G.board[row][col] = null;
            }
        }
    }
}

export function selectNextPlayer(G: GameData) {
    if (G.currentPlayerKLUDGE === G.playerData.length - 1) {
        G.currentPlayerKLUDGE = 0;
    } else {
        ++G.currentPlayerKLUDGE;
    }
}

export function addToRack(G: GameData, l: Letter) {
    let rack = G.playerData[G.currentPlayerKLUDGE].rack;
    let emptyIndex = rack.findIndex(l => l === null);
    assert(emptyIndex >= 0, "Attempt to add to full rack");
    rack[emptyIndex] = l;
}

/* move blank spaces to the end */
export function compactRack(G: GameData) {
    let rack = G.playerData[G.currentPlayerKLUDGE].rack;

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
    sq: SquareID, 
    letter: Letter | null, 
    rackAction : RackAction = RackAction.overwrite,  
    ) {
    if(onRack(sq)) {
        let rack = [...G.playerData[G.currentPlayerKLUDGE].rack];
        const pos = rackPos(sq);
        if(rackAction === RackAction.insert) {
            makeRackGap(rack, pos);
        }
        rack[pos] = letter;
        G.playerData[G.currentPlayerKLUDGE].rack = rack; 
    } else {
        let row = [...G.board[sq.row]];
        row[sq.col] = letter && {letter:letter, active: true};
        G.board[sq.row] = row; 
    }
}

export function moveFunctions(props: BoardProps<GameData>) : MoveFunctions {
    const { G: {board} } = props;
    const moves  = props.moves as any as ClientMoves;

    const isActive = (sq: SquareID) : boolean =>
    {
        return onRack(sq) || Boolean(board[sq.row][sq.col]?.active);
    } 
    return {
      onMoveStart: (sq: SquareID) => {
        const canMove = isActive(sq); 
        if(canMove) {
            moves.start(sq);
        }
        return canMove;
      },
  
      onMoveEnd: (from: SquareID, to: SquareID | null) => {
        if(to) {
            moves.move(from, to);
        }
      },

      dragType: () => DragType.move,
    }
  };

export function canSwapTiles(G: GameData) {
    return G.bag.length >= 7;
}