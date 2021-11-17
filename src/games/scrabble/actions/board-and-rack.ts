import { sAssert } from "shared/assert";
import { CoreTile, makeCoreTile } from "./core-tile";
import { BoardData } from "./general-game-data";
import { blank, Letter } from "../config";
import { sameJSON, shuffle } from "shared/tools";
import { addToRack, boardIDs, compactRack, onRack } from "./game-actions";
import { SquareID } from "./actions";

export type Rack = (CoreTile | null)[];

export type TilePosition = 
    {
        rack: {pos: number}; 
        board?: undefined;
    } |
    {
        rack?: undefined;
        board: {row: number; col: number;}
    };

function tilePosition(sq: SquareID): TilePosition {
    if (onRack(sq)) {
        return { rack: { pos: sq.col } };
    } else {
        return { board: sq };
    }
}
    
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
 * BoardAndRack is a helper class for Actions.  It provides function to update 
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

    getTile(tp: TilePosition): CoreTile | null {
        if (tp.rack) {
            return this.rack[tp.rack.pos];
        } else {
            return this.board[tp.board.row][tp.board.col];
        }
    }

    setActiveTile(tp: TilePosition, tile: CoreTile | null): void {
        if (tp.rack) {
            this.rack[tp.rack.pos] = tile;
        } else {
            this.board[tp.board.row][tp.board.col] = tile && {
                ...tile,
                active: true,
            };
        }
    }

    private setRackTile(tile: CoreTile | null, pos: number) {
        // User suppled values for blanks are cleared when in rack.
        if(tile?.isBlank) {
            this.rack[pos] = makeCoreTile(blank);
        } else {
            this.rack[pos] = tile;
        }
    }

    addToRack(tile: CoreTile): void {
        const emptySquare = this.rack.findIndex(l => l === null);
        sAssert(emptySquare >= 0, "Problem adding tile to rack");
        this.setRackTile(tile, emptySquare);
    }

    insertIntoRack(tp: TilePosition, tile: CoreTile | null): void {
        sAssert(tp.rack);
        const pos = tp.rack.pos;
        
        if(moveTilesDown(this.rack, pos) || moveTilesUp(this.rack, pos)) {
            this.setRackTile(tile, pos);
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

    move(arg: {from: SquareID,to: SquareID}) : void {
        const from = tilePosition(arg.from);
        const to = tilePosition(arg.to);
        if(sameJSON(from,to)) {
            return;
        }

        const fromLetter = this.getTile(from);
        const toLetter  = this.getTile(to);

        // Do nothing if attempting to move onto an inactive tile.
        if (toLetter === null) {
            this.setActiveTile(from, null);
            this.setActiveTile(to, fromLetter);
        } else if (to.rack) {
            this.setActiveTile(from, null);
            this.insertIntoRack(to, fromLetter);
        } else if (this.isActive(to)) {
            this.setActiveTile(from, null);
            this.addToRack(toLetter);
            this.setActiveTile(to, fromLetter);
        }
    }

    recallRack(): void {
        for (let row = 0; row < this.board.length; ++row) {
            for (let col = 0; col < this.board[row].length; ++col) {
                const tile = this.board[row][col];
                if (tile?.active) {
                    addToRack(this.rack, tile);
                    this.board[row][col] = null;
                }
            }
        }
    }

    shuffleRack(): void {
        shuffle(this.rack);
        compactRack(this.rack);
    }
    
    setBlack(id: SquareID, letter: Letter) : void {
        sAssert(!onRack(id));

        const sq = this.board[id.row][id.col];
        sAssert(sq && sq.isBlank, "Cannot set blank", "Square=", sq);
        sq.letter = letter;
    }
}


/* TO DO:  Consider making this part of BoardAndRack. */
export function findUnsetBlack(board: BoardData): SquareID | null {
    for (let row = 0; row < board.length; ++row) {
        for (let col = 0; col < board[row].length; ++col) {
            if(board[row][col]?.letter === blank) {
                return {
                    row: row,
                    col: col,
                    boardID: boardIDs.main,
                };
            }
        }
    }

    return null;
}
