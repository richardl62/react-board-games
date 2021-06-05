import { assertAlert as assert } from '../../shared/assert';
import { sameJSON } from "../../shared/tools";
import * as Basic from "../basic";
import { MoveFunctions, SquareID } from "./types";

export class ClickDrag {

    constructor(moveFunctions: MoveFunctions) {
        this.moveFunctions = moveFunctions;
    }
    readonly moveFunctions: MoveFunctions;

    private _start: SquareID | null = null;
    get start() { return this._start; }

    private _firstSquareClicked: boolean = false;
    get firstSquareClicked() { return this._firstSquareClicked; }

    show(str: string) {
        console.log(`MoveStatus.${str}:`, this._start?.row, this._start?.col,
            this._firstSquareClicked);
    }
    reset() {
        this._start = null;
        this._firstSquareClicked = false;
        //this.show('reset');
    }

    recordMoveStart(sq: SquareID) {
        assert(this.start === null, "Start square aleady selected")
        assert(!this.firstSquareClicked, "firstSquareClicked set");

        this._start = sq;
        //this.show('recordMoveStart');
    }

    markAsClickMove(sq: SquareID) {
        assert(this.start !== null, "Start square not recorded")
        assert(!this.firstSquareClicked, "firstSquareClicked already set");

        this._firstSquareClicked = true;
        //this.show('markAsClickMove');
    }

    basicOnFunctions() {
        const { onClick, onMoveStart, onMoveEnd, allowDrag } = this.moveFunctions;

        const moveStart = (sq: SquareID) => {
            this.recordMoveStart(sq);

            //console.log('moveStart', sq);
            onMoveStart?.(sq);
        }

        const moveEnd = (sq: SquareID | null) => {
            const start = this.start;
            this.reset();
    
            assert(start !== null, "start square is null at end of Move");
    
            //console.log('moveEnd', start, sq);
            onMoveEnd?.(start, sq);
        }

        const onFuncs: Basic.OnFunctions<SquareID> = {

            onMouseDown: (sq: SquareID) => {
                //console.log("onMouseDown", sq.toString());

                if (!this.start) {
                    moveStart(sq);
                } else if (this.firstSquareClicked) {
                    // Do nothing
                } else {
                    // Cancel the previously started move and start a new one
                    moveEnd(null);
                    moveStart(sq);
                }
            },

            onClick: (id: SquareID) => {
                //console.log("onClick", id.toString());

                onClick?.(id);

                if (this.start) {
                    if (this.firstSquareClicked) {
                        moveEnd(id);
                    } else {
                        this.markAsClickMove(id);
                    }
                } else {
                    console.error("No start square recorded on click");
                }
            },

            allowDrag: (from: SquareID): boolean => {
                // Disallow drags during a click-move unless from the starting square
                // of that move.
                if (this.firstSquareClicked && !sameJSON(from, this.start)) {
                    return false;
                }

                return allowDrag ? allowDrag(from) : true;
            },

            onDrop: (from: SquareID, to: SquareID | null) => {
                assert(sameJSON(from, this.start), "inconsistent start square for drop",
                    from, this.start);
                moveEnd(to);
            },
        }

        return onFuncs;
    }
}