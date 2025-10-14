import { sAssert } from "../../../utils/assert";
import { ExtendedLetter, makeExtendedLetter } from "./extended-letter";
import { blank, Letter } from "../config";
import { shuffle } from "../../../utils/shuffle";
import { addToRack, boardIDs, compactRack, onRack, sameSquareID, SquareID } from "./game-actions";
import { BoardData, BoardSquareData } from "../server-side/game-state";
import { WordPosition } from "../../../utils/word-finder/get-legal-words/word-position";

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
 * BoardAndRack provides function to update (wait for it) a board and rank. 
 * It does not know anything about setting state or calling Bgio.
 * 
 * CrossTiles GridAndRack has an editted copy of some of this code.
*/
export class BoardAndRack {
    constructor(board: BoardData, rack: Rack) {
        this.board = board.map(row => [...row]);
        this.rack = [...rack];
    }

    private board: BoardData;
    private rack: Rack;

    evalBoard(row : number, col: number) : BoardSquareData | null | undefined {
        const r = this.board[row];
        return r ? r[col] : undefined;
    } 

    getExtendedLetter(tp: TilePosition): ExtendedLetter | null {
        if (tp.rack) {
            const letter = this.rack[tp.rack.pos];
            return letter && makeExtendedLetter(letter);
        } else {
            return this.board[tp.board.row][tp.board.col];
        }
    }

    setActiveTile(tp: TilePosition, letter: ExtendedLetter | null): void {
        if (tp.rack) {
            this.setRackTile(letter, tp.rack.pos);
        } else {
            this.board[tp.board.row][tp.board.col] = letter && {
                ...letter,
                active: true,
            };
        }
    }

    private setRackTile(letter: ExtendedLetter | null, pos: number) {
        // User suppled values for blanks are cleared when in rack.
        if (letter == null) {
            this.rack[pos] = null;
        } else if(letter.isBlank) {
            this.rack[pos] = blank;
        } else {
            this.rack[pos] = letter.letter;
        }
    }

    addToRack(letter: ExtendedLetter): void {
        const emptySquare = this.rack.findIndex(l => l === null);
        sAssert(emptySquare >= 0, "Problem adding tile to rack");
        this.setRackTile(letter, emptySquare);
    }

    insertIntoRack(tp: TilePosition, letter: ExtendedLetter): void {
        sAssert(tp.rack);
        const pos = tp.rack.pos;
        
        if(moveTilesDown(this.rack, pos) || moveTilesUp(this.rack, pos)) {
            this.setRackTile(letter, pos);
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

    getBoardLetters() : (Letter|null)[][] {
        return this.board.map(row => row.map(sq => sq && sq.letter));
    }

    /** 
     * Moves should be from an active square to an empty or active square.
     * This function does nothing if thid rule is broken. (The rule might
     * 'legitimately' be broken if the board is update due to another player's
     * move during a drag.)
     */
    move(arg: {from: SquareID,to: SquareID}) : void {

        const from = tilePosition(arg.from);
        const to = tilePosition(arg.to);

        const fromLetter = this.getExtendedLetter(from);
        const toLetter  = this.getExtendedLetter(to);

        if(sameSquareID(arg.from, arg.to)) {
            return;
        }

        if(fromLetter === null) {
            // Attempt to move from a empty square
            return;
        }

        if(!this.isActive(from)) {
            // Attempt to move from a non-active square
            return;
        }

        if (toLetter === null) {
            this.setActiveTile(from, null);
            this.setActiveTile(to, fromLetter);
        } else if (to.rack) {
            if(this.rackIsFull && !from.rack ) {
                // Hmm. As far as I can see something would have to go badly wrong
                // for this to arise.
                console.warn("Attempt to move tile onto a full rack");
            } else {
                this.setActiveTile(from, null);
                this.insertIntoRack(to, fromLetter);
            }
        } else if (to.board && this.isActive(to)) {
            this.setActiveTile(from, null);
            this.addToRack(toLetter);
            this.setActiveTile(to, fromLetter);
        } else {
            // Attempt a non-empty and non-active square
        }
    }

    moveFromRack({start, rackPos} : {start: WordPosition, rackPos: number}) : SquareID | null {
        let { row, col } = start;

        if( start.direction === "row") {
            while(this.evalBoard(row,col)) {
                col++;
            }
        } else {
            while(this.evalBoard(row,col)) {
                row++;
            }
        }

        if( this.evalBoard(row,col) === undefined ) {
            // [row][col] off the board. Do nothing in this case.
            return null;
        } else {
            const rackLetter = this.rack[rackPos];
            this.setActiveTile(
                {board: {row: row, col: col}},
                rackLetter && makeExtendedLetter(rackLetter),
            );
            this.rack[rackPos] = null;
            return {boardID: boardIDs.main, row: row, col: col};
        }
    }

    moveToRack(from: {row: number, col: number} ) : void {
        const fromPos : TilePosition = {board: from};
        const fromLetter = this.getExtendedLetter(fromPos);
        sAssert(fromLetter && this.isActive(fromPos), "Attempt to move non-active tile");
        
        this.setActiveTile(fromPos, null);
        this.addToRack(fromLetter);
    }

    /** Find the rack position of the first instance of the given letter. Return null if 
     * the letter is not found. (Any string can be passed in. But if the string is not a 
     * letter, null is returned.) 
     * The check is case insensitive. 
     */
    findInRack( letter: string ) : number | null {
        const candidateLetter = letter.toUpperCase();
        for(let rackPos = 0; rackPos < this.rack.length; ++rackPos) {
            if(this.rack[rackPos] === candidateLetter) {
                return rackPos;
            }
        }

        return null;
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
    
    setBlank(id: SquareID, letter: Letter) : void {
        sAssert(!onRack(id));

        const sq = this.board[id.row][id.col];
        sAssert(sq && sq.isBlank, "Cannot set blank", "Square=", sq);
        sq.letter = letter;
    }

    get nTilesInRack() : number {
        let nTiles = 0;
        for(const elem of this.rack) {
            if(elem) {
                ++nTiles;
            }
        }

        return nTiles;
    }

    get rackIsFull() : boolean {
        return this.nTilesInRack === this.rack.length;
    }

    activeTilesOnBoard(): SquareID [] {
        const active: SquareID [] = [];
        for (let row = 0; row < this.board.length; ++row) {
            for (let col = 0; col < this.board[row].length; ++col) {
                if(this.board[row][col]?.active) {
                    active.push({
                        row: row,
                        col: col,
                        boardID: boardIDs.main,
                    });
                }
            }
        }

        return active;
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
