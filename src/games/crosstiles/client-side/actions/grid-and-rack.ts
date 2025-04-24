import { sAssert } from "../../../../utils/assert";
import { shuffle } from "../../../../utils/shuffle";
import { Letter } from "../../config";
import { ClickMoveStart, sameSquareID, SquareID } from "./types";

type Grid = (Letter|null)[][];
type Rack = (Letter|null)[];


/* This is an edit copy of some code from Scrabble Board and Rack */
export class GridAndRack {
    constructor(grid: Grid, rack: Rack) {
        this.grid = grid.map(row => [...row]);
        this.rack = [...rack];
    }

    grid: Grid;
    rack: Rack;

    get(sq: SquareID) : Letter | null {
        if(sq.container === "rack") {
            return this.rack[sq.col];
        } else {
            return this.grid[sq.row][sq.col];
        }
    } 

    private set(sq: SquareID, val: Letter | null) : void  {
        if(sq.container === "rack") {
            this.rack[sq.col] = val;
        } else {
            this.grid[sq.row][sq.col] = val;
        }
    } 

    /** Find the rack position of the first instance of the given letter. Return null if 
     * the letter is not found. (Any string can be passed in. But if the string is not a 
     * letter, null is returned.) 
     * The check is case insensitive. 
     */
    findInRack(letter: string): number | null {
        const candidateLetter = letter.toUpperCase();
        for (let rackPos = 0; rackPos < this.rack.length; ++rackPos) {
            if (this.rack[rackPos] === candidateLetter) {
                return rackPos;
            }
        }

        return null;
    }

    private addToRack(letter: Letter): void {
        const emptySquare = this.rack.findIndex(l => l === null);
        sAssert(emptySquare >= 0, "Problem adding tile to rack");
        this.rack[emptySquare] = letter;
    }

    /** Move a tile from grid to rack */
    moveToRack(sq: SquareID): void {
        sAssert(sq.container === "grid", "unexpected parameter in moveToRack");
        const letter = this.get(sq);
        sAssert(letter, "null letter in moveToRack");
        
        this.set(sq,null);
        this.addToRack(letter);
    }

    /** 
     * Moves should be from an active square to an empty or active square.
     * This function does nothing if thid rule is broken. (The rule might
     * 'legitimately' be broken if the board is update due to another player's
     * move during a drag.)
     */
    move(from: SquareID, to: SquareID) : void {
        const fromVal = this.get(from);
        const toVal = this.get(to);

        if(sameSquareID(from,to)) {
            return;
        }
        sAssert(fromVal, "null from value in move");

        if (to.container === "grid") {
            this.set(from, null);
            if (toVal) {
                this.addToRack(toVal);
            }
            this.set(to, fromVal);
        } else {
            this.set(from, null);
            this.insertIntoRack(to.col, fromVal);
        }
    }

    private insertIntoRack(pos: number, letter: Letter): void {
        const rack = this.rack;

        const moveTilesUp = (posToClear: number) => {
            let posOfGap = null;
            for (let pos = posToClear; pos <= rack.length; ++pos) {
                if (rack[pos] === null) {
                    posOfGap = pos;
                    break;
                }
            }
            if (posOfGap === null) {
                return false;
            }

            for (let pos = posOfGap; pos > posToClear; --pos) {
                rack[pos] = rack[pos - 1];
            }
            rack[posToClear] = null;

            return true;
        };

        const moveTilesDown = (posToClear: number) => {
            rack.reverse();
            const posToClearReversed = rack.length - (posToClear + 1);
            const result = moveTilesUp(posToClearReversed);
            rack.reverse();

            return result;
        };

        if (moveTilesDown(pos) || moveTilesUp(pos)) {
            rack[pos] = letter;
        } else {
            throw new Error("attempt to insert into full rack");
        }
    }

    moveFromRack(start: ClickMoveStart, rackPos: number) : void {     
        sAssert(this.rack[rackPos], "Unexpected null tile in moveFromRack");

        let { row, col } = start;
        if( start.direction === "row") {
            while(this.grid[row][col]) {
                col++;
            }
        } else {
            while(this.grid[row][col]) {
                row++;
            }
        }

        if( this.grid[row][col] === undefined ) {
            // [row][col] off the board. Do nothing in this case.
        } else {
            this.grid[row][col] = this.rack[rackPos];
            this.rack[rackPos] = null;
        }
    }

    private compactRack(): void {
        const rackLength = this.rack.length;
        this.rack = this.rack.filter(elem => elem !== null);
        while (this.rack.length < rackLength) {
            this.rack.push(null);
        }
    }

    shuffleRack(): void {
        shuffle(this.rack);
        this.compactRack();
    }

    recallToRack(): void {
        for(let r = 0; r < this.grid.length; ++r) {
            const row = this.grid[r];
            for(let c = 0; c < row.length; ++c) {
                if(row[c]) {
                    this.addToRack(row[c]!);
                    row[c] = null;
                }
            }
        }
    }
}
