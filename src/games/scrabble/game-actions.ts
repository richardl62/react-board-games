import { DragType, MoveFunctions, SquareID } from "../../boards";
import assert from "../../shared/assert";
import { sameJSON, shuffle } from "../../shared/tools";
import { Bgio } from "../../shared/types";
import { Letter } from "./letter-properties";
import { TileData, GameData } from "./game-data";

const playerNumber = 0;
export const boardIDs = {
    rack: 'rack',
    main: 'main',
}

function onRack(sq: SquareID | null): boolean {
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


function canChange(G: GameData, sq: SquareID) : boolean
{
    return onRack(sq) || G.board[sq.row][sq.col] === null;
} 

/** get the letter at a square */
function getSquareData(G: GameData, sq: SquareID) : TileData | null {
    if(onRack(sq)) {
        const letter = G.racks[playerNumber][rackPos(sq)];
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


function refillRack(G: GameData) {
    // Refill the rack
    let rack = G.racks[playerNumber];
    let bag = G.bag;
    for(let i = 0; i < rack.length; ++i) {
        if(rack[i] === null && bag.length > 0) {
            rack[i] = bag.pop()!;
        }
    }
}

function addToRack(G: GameData, l: Letter) {
    let rack = G.racks[playerNumber];
    let emptyIndex = rack.findIndex(l => l === null);
    assert(emptyIndex >= 0, "Attempt to add to full rack");
    rack[emptyIndex] = l;
}

/* move blank spaces to the end */
function compactRack(G: GameData) {
    let rack = G.racks[playerNumber];

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

enum RackAction {
    insert,
    overwrite,
}
/** Set a square to a given value */
function setLetter(
    G: GameData, 
    sq: SquareID, 
    letter: Letter | null, 
    rackAction : RackAction = RackAction.overwrite,  
    ) {
    if(onRack(sq)) {
        let rack = [...G.racks[playerNumber]];
        const pos = rackPos(sq);
        if(rackAction === RackAction.insert) {
            makeRackGap(rack, pos);
        }
        rack[pos] = letter;
        G.racks[playerNumber] = rack; 
    } else {
        let row = [...G.board[sq.row]];
        row[sq.col] = letter && {letter:letter, active: true};
        G.board[sq.row] = row; 
    }
}

export const bgioMoves = {
    start: (G: GameData, ctx: any, sq: SquareID) => {
        G.moveStart = sq;
    },

    move: (G: GameData, ctx: any, fromSq: SquareID, toSq: SquareID) => {
        if(canChange(G, toSq) && !sameJSON(fromSq, toSq)) {
            const squareData = getSquareData(G, fromSq);
            setLetter(G, fromSq, null);
            setLetter(G, toSq, squareData && squareData.letter, RackAction.insert);
            compactRack(G);
        }
    },

    recallRack: (G: GameData) => {
        for(let row = 0; row < G.board.length; ++row) {
            for(let col = 0; col < G.board[row].length; ++col) {
                let sq = G.board[row][col];
                if(sq?.active) {
                    addToRack(G, sq.letter);
                    G.board[row][col] = null;
                }
            }
        }
        
    },

    shuffleRack: (G: GameData) => {
        shuffle(G.racks[playerNumber]);
    },

    finishTurn: (G: GameData, ctx: any, score: number) => {
        refillRack(G);

        // Mark board entires as non-active
        G.board.forEach(row =>
            row.forEach(sd => sd && (sd.active = false))
        );
    }
};

export function moveFunctions(props: Bgio.BoardProps<GameData>) : MoveFunctions {
    const { G: {board}, moves } = props;

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
        moves.move(from, to);
      },

      dragType: () => DragType.move,
    }
  };

