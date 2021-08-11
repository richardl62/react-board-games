import { sAssert } from "../../shared/assert";
import { BoardData } from "./game-data";
import { Letter } from "./scrabble-config";
import { Rack } from "./scrabble-data";

export type TilePosition = 
    {
        rack: {pos: number}; 
        board?: undefined;
    } |
    {
        rack?: undefined;
        board: {row: number; col: number;}
    };


/** 
 * BoardAndRack provides function to update (wait for ut) a board and rank.
 * It does not know anything about setting state of calling Bgio.
*/
export class BoardAndRack {
    constructor(board: BoardData, rack: Rack) {

        this.board = board.map(row => [...row]);
        this.rack = [...rack];
    }

    private board: BoardData;
    private rack: Rack;

    resetBoard(board: BoardData) {
        this.board = board.map(row => [...row]);
    }

    resetRack(rack: Rack) {
        this.rack = [...rack];
    }

    getLetter(tp: TilePosition): Letter | null {
        if (tp.rack) {
            return this.rack[tp.rack.pos];
        } else {
            const bsq = this.board[tp.board.row][tp.board.col];
            return bsq && bsq.letter;
        }
    }

    setActiveLetter(tp: TilePosition, letter: Letter | null) {
        if (tp.rack) {
            this.rack[tp.rack.pos] = letter;
        } else {
            this.board[tp.board.row][tp.board.col] = letter && {
                letter: letter,
                active: true,
            };
        }
    }

    insertIntoRack(tp: TilePosition, letter: Letter | null) {
        sAssert(tp.rack);
        //TEMPORARY - crude initial implementation
        for (let i = 0; i < this.rack.length; ++i) {
            if (this.rack[i] === null) {
                this.rack[i] = letter;
            }
        }

        sAssert(false, "attempt to insert into full rack");
    }

    isPlayable(tp: TilePosition): boolean {
        if (tp.rack) {
            return true;
        }

        const bsq = this.board[tp.board.row][tp.board.col];
        return Boolean(bsq && bsq.active);
    }

    getRack(): Rack {
        return this.rack;
    }

    getBoard(): BoardData {
        return this.board;
    }

    getRackFromState(): Rack {
        return this.rack;
    }
}
