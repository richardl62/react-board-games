import { sAssert } from "../../shared/assert";
import { BoardData } from "./game-data";
import { Letter } from "./scrabble-config";

export type Rack = (Letter | null)[];

export type TilePosition = 
    {
        rack: {pos: number}; 
        board?: undefined;
    } |
    {
        rack?: undefined;
        board: {row: number; col: number;}
    };


function moveTilesUp(rack: Rack, posToClear: number) : boolean {
    let posOfGap = null;
    for(let pos = posToClear; pos <= rack.length; ++pos) {
        if(rack[pos] === null) {
            posOfGap = pos;
            break;
        }
    }
    if(posOfGap === null) {
        return false;
    }
    
    for(let pos = posOfGap; pos > posToClear; --pos) {
        rack[pos] = rack[pos-1];
    }
    rack[posToClear] = null;


    return true;
}

function moveTilesDown(rack: Rack, posToClear: number): boolean {
    rack.reverse();
    const posToClearReversed = rack.length - (posToClear + 1);
    const result = moveTilesUp(rack, posToClearReversed);
    rack.reverse();

    sAssert(rack[posToClear] === null || !result, "Problem rearranging tiles in rack");
    return result;
}


/** 
 * BoardAndRack is a helper class for ScrabbleData.  It provides function to update 
 * (wait for it) a board and rank. It does not know anything about setting state 
 * or calling Bgio.
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

    addToRack(letter: Letter) {
        const emptySquare = this.rack.findIndex(l => l === null);
        sAssert(emptySquare >= 0, "Problem adding tile to rack");
        this.rack[emptySquare] = letter;
    }

    insertIntoRack(tp: TilePosition, letter: Letter | null) {
        sAssert(tp.rack);
        const pos = tp.rack.pos;
        
        if(moveTilesDown(this.rack, pos) || moveTilesUp(this.rack, pos)) {
            this.rack[pos] = letter;
        } else {
            throw new Error("attempt to insert into full rack");
        }
    }

    /** Check if there is an active tile at the given position.
     *  'active' tiles are those that can be moved during the current turn.
     *  (So they are either on the rack or were moved from the rack during the
     *  current turn.)
     *  If there is no tile at the given position the function returns false.
     */
    isActive(tp: TilePosition): boolean {
        if (tp.rack) {
            return Boolean(this.rack[tp.rack.pos]);
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
