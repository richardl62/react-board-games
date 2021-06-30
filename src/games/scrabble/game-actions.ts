import { MoveFunctions, SquareID } from "../../boards";
import assert from "../../shared/assert";
import { sameJSON, shuffle } from "../../shared/tools";
import { Bgio } from "../../shared/types";
import { Letter } from "./letter-properties";
import { SquareData, GameData } from "./game-data";

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

/** get the letter at a square */
function getSquareData(G: GameData, sq: SquareID) : SquareData | null {
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

function finishTurn(G: GameData) {
    let rack = G.racks[playerNumber];
    let bag = G.bag;
    for(let i = 0; i < rack.length; ++i) {
        if(rack[i] === null && bag.length > 0) {
            rack[i] = bag.pop()!;
        }
    }

    G.board.forEach(row => 
        row.forEach(sd => sd && (sd.active = false))
    );
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

        const squareData = getSquareData(G, fromSq);
        setLetter(G, fromSq, null);
        setLetter(G, toSq, squareData && squareData.letter, RackAction.insert);
    },

    shuffleRack: (G: GameData) => {
        shuffle(G.racks[playerNumber]);
    },

    finishTurn: finishTurn,
};

export function moveFunctions(props: Bgio.BoardProps<GameData>) : MoveFunctions {
    const { G: {moveStart}, moves } = props;

    return {
      onMoveStart: (sq: SquareID) => {
        moves.start(sq);
        return true;
      },
  
      onMoveEnd: (from: SquareID, to: SquareID | null) => {
        assert(sameJSON(moveStart, from));
        moves.move(from, to);
      }
    }
  };

