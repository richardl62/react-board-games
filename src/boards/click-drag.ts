import { assertAlert as assert } from '../shared/assert';
import { sameJSON } from "../shared/tools";
import { MoveFunctions, SquareID } from "./interfaces";
import { OnFunctions } from './square';

export class ClickDrag {

    constructor(moveFunctions: MoveFunctions) {
        this.moveFunctions = moveFunctions;
    }

    readonly moveFunctions: MoveFunctions;

    private _start: SquareID | null = null;
    get start() { return this._start; }

    private _firstSquareClicked: boolean = false;
    get firstSquareClicked() { return this._firstSquareClicked; }

    private show(str: string) {
        console.log(`MoveStatus.${str}:`, this._start?.row, this._start?.col,
            this._firstSquareClicked);
    }

    private reset() {
        this._start = null;
        this._firstSquareClicked = false;
        //this.show('reset');
    }

    private recordMoveStart(sq: SquareID) {
        assert(this.start === null, "Start square aleady selected")
        assert(!this.firstSquareClicked, "firstSquareClicked set");

        this._start = sq;
        //this.show('recordMoveStart');
    }

    private markAsClickMove(sq: SquareID) {
        assert(this.start !== null, "Start square not recorded")
        assert(!this.firstSquareClicked, "firstSquareClicked already set");

        this._firstSquareClicked = true;
        //this.show('markAsClickMove');
    }

    private moveStart(sq: SquareID) {
        this.recordMoveStart(sq);

        //console.log('moveStart', sq);
        this.moveFunctions.onMoveStart?.(sq);
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
        } else if (this.firstSquareClicked) {
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
            if (this.firstSquareClicked) {
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
        if (this.firstSquareClicked && !sameJSON(from, this.start)) {
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