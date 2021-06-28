import { MoveFunctions, SquareID } from "../../boards";
import assert from "../../shared/assert";
import { nestedArrayMap, sameJSON } from "../../shared/tools";
import { Bgio } from "../../shared/types";
import { Letter, squareTypesArray } from "./game-properties";

export interface GameData {
    board: (Letter | null)[][],
    racks: (Letter | null)[][],
    moveStart: SquareID | null,
}

const playerNumber = 0;

export function startingGameData() : GameData {
    return {
        board: nestedArrayMap(squareTypesArray, () => null), // KLUDGE?
        racks:[
            ['A', 'B', 'C', 'D', 'E', 'F', '?'],
        ],
        moveStart: null,
    }
}

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
function getLetter(G: GameData, sq: SquareID) : Letter | null {
    if(onRack(sq)) {
        return G.racks[playerNumber][rackPos(sq)]
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

enum RackAction {
    insert,
    overwrite,
}
/** Set a square to a given value */
function setLetter(
    G: GameData, sq: SquareID, 
    value: Letter | null, 
    rackAction : RackAction = RackAction.overwrite,  
    ) {
    if(onRack(sq)) {
        let rack = [...G.racks[playerNumber]];
        const pos = rackPos(sq);
        if(rackAction === RackAction.insert) {
            makeRackGap(rack, pos);
        }
        rack[pos] = value;
        G.racks[playerNumber] = rack; 
    } else {
        let row = [...G.board[sq.row]];
        row[sq.col] = value;
        G.board[sq.row] = row; 
    }
}

export const moves = {
    start: (G: GameData, ctx: any, sq: SquareID) => {
        G.moveStart = sq;
    },

    move: (
        G: GameData, 
        ctx: any, 
        fromSq: SquareID, 
        toSq: SquareID
        ) => {

        const letter = getLetter(G, fromSq);
        setLetter(G, fromSq, null);
        setLetter(G, toSq, letter, RackAction.insert);
    },
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

