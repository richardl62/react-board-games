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
        const playerNumber = 0;
        let rack = [...G.racks[playerNumber]];
        let newBoard = [...G.board];

        if(onRack(fromSq) && onRack(toSq)) {
            moveInRack(fromSq, toSq, rack);
        }

        if(!onRack(toSq)) {
            newBoard[toSq.row][toSq.col] = 'A';
        }
        G.racks[playerNumber] = rack;
    },
};

function moveInRack(fromSq: SquareID, toSq: SquareID, rack: (Letter | null)[]) {
    const from = rackPos(fromSq);
    const to = rackPos(toSq);
    const fromVal = rack[from];
    if (from < to) {
        for (let ind = from; ind < to; ++ind) {
            rack[ind] = rack[ind + 1];
        }
    } else {
        for (let ind = from; ind > to; --ind) {
            rack[ind] = rack[ind - 1];
        }
    }
    rack[to] = fromVal;
}

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