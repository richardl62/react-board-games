import { assertAlert as assert } from '../shared/assert';
import { sameJSON } from "../shared/tools";
import { MoveFunctions, SquareID } from "./interfaces";
import { OnFunctions } from './internal/square';

// KLUDGE?:  This classes records state that might be better recorded as part
// the game data (i.e. as part of G in bgio terminology).
export class ClickDrag {

    constructor(moveFunctions: MoveFunctions) {
        this.moveFunctions = moveFunctions;
    }

    readonly moveFunctions: MoveFunctions;

    private _start: SquareID | null = null;
    get start() { return this._start; }

    private startedClickMove: boolean = false;

    private show(str: string) {
        console.log(`MoveStatus.${str}:`, this._start?.row, this._start?.col,
            this.startedClickMove);
    }

    private reset() {
        this._start = null;
        this.startedClickMove = false;
        //this.show('reset');
    }

    private recordMoveStart(sq: SquareID) {
        assert(this.start === null, "Start square aleady selected")
        assert(!this.startedClickMove, "started click move");

        this._start = sq;
        //this.show('recordMoveStart');
    }

    private markAsClickMove(sq: SquareID) {
        assert(this.start !== null, "Start square not recorded")
        assert(!this.startedClickMove, "Click move not started");

        this.startedClickMove = true;
        //this.show('markAsClickMove');
    }

    private moveStart(sq: SquareID) {
        let doMove;
        if(!this.moveFunctions.onMoveStart) {
            doMove = true;
        } else {
            doMove = this.moveFunctions.onMoveStart(sq);
        }
        
        if(doMove) {
            this.recordMoveStart(sq);
        }
        //console.log('moveStart', sq);

    }

    private moveEnd(sq: SquareID | null) {
        const start = this.start;
        this.reset();

        assert(start !== null, "start square is null at end of Move");

        //console.log('moveEnd', start, sq);
        this.moveFunctions.onMoveEnd?.(start, sq);
    }

    private onMouseDown(sq: SquareID) {
        //console.log("onMouseDown", sq.toString());

        if (!this.start) {
            this.moveStart(sq);
        } else if (this.startedClickMove) {
            // Do nothing
        } else {
            // Cancel the previously started move and start a new one
            this.moveEnd(null);
            this.moveStart(sq);
        }
    }

    onClick(id: SquareID) {

        this.moveFunctions.onClick?.(id);

        if (this.start) {
            if (this.startedClickMove) {
                this.moveEnd(id);
            } else {
                this.markAsClickMove(id);
            }
        } else {
            console.error("No start square recorded on click");
        }
    }

    private allowDrag(from: SquareID): boolean {
        // Disallow drags during a click-move unless from the starting square
        // of that move.
        if (this.startedClickMove && !sameJSON(from, this.start)) {
            return false;
        }
        const allowDrag = this.moveFunctions.allowDrag
        return allowDrag ? allowDrag(from) : true;
    }

    private onDrop(from: SquareID, to: SquareID | null) {
        assert(sameJSON(from, this.start), "inconsistent start square for drop",
            from, this.start);
        this.moveEnd(to);
    }

    basicOnFunctions() : Required<OnFunctions> {
        return {
            onMouseDown: (sq: SquareID) => this.onMouseDown(sq),
            onClick: (sq: SquareID) => this.onClick(sq),
            allowDrag: (sq: SquareID) => this.allowDrag(sq),
            onDrop: (from: SquareID, to: SquareID | null) => this.onDrop(from, to),
        };
    }
}
