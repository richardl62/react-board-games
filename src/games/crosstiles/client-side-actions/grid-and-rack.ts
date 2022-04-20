import { sAssert } from "../../../utils/assert";
import { shuffle } from "../../../utils/shuffle";
import { Letter } from "../config";
import { ClickMoveStart, SquareID } from "./types";

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

    set(sq: SquareID, val: Letter | null) : void  {
        if(sq.container === "rack") {
            this.rack[sq.col] = val;
        } else {
            this.grid[sq.row][sq.col] = val;
        }
    } 


    addToRack(letter: Letter): void {
        const emptySquare = this.rack.findIndex(l => l === null);
        sAssert(emptySquare >= 0, "Problem adding tile to rack");
        this.rack[emptySquare] = letter;
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
        sAssert(fromVal);

        if (to.container === "grid") {
            this.set(from, null);
            toVal && this.addToRack(toVal);
            this.set(to, fromVal);
        } else {
            this.set(from, null);
            this.insertIntoRack(to.col, fromVal);
        }
    }

    insertIntoRack(pos: number, letter: Letter): void {
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
        let { row, col } = start;

        if( start.direction === "right") {
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

    compactRack(): void {
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