import { assertThrow as assert } from '../shared/assert';
import { sameJSON } from "../shared/tools";
import { MoveFunctions, SquareID } from "./interfaces";
import { OnFunctions } from './internal/square';

type MoveType = 'none' | 'undetermined' | 'click' | 'drag';

// KLUDGE?:  This classes records state that might be better recorded as part
// the game data (i.e. as part of G in bgio terminology).
export class ClickDrag {

    constructor(moveFunctions: MoveFunctions) {
        this.moveFunctions = moveFunctions;
    }

    readonly moveFunctions: MoveFunctions;

    private _start: SquareID | null = null
    get start() { return this._start; }

    private moveType: MoveType = 'none';

    private show(str: string) {
        console.log(`MoveStatus.${str}:`, this._start?.row, this._start?.col,
            this.moveType);
    }

    private reset() {
        this._start = null;
        this.moveType = 'none';
        //this.show('reset');
    }

    private onMouseDown(sq: SquareID) {
        //console.log("onMouseDown", sq.toString());

        // A mouse-down with no move in progress starts a move 
        // (unless disallowed by callback). At this time the type
        // of the move is undetermined.
        if (this.moveType === 'none') {
            const startMove = !this.moveFunctions.onMoveStart 
                || this.moveFunctions.onMoveStart(sq);

            if(startMove) {
                this.moveType = 'undetermined';
                this._start = sq;
            }
        } else {
            // It must be the 2nd click in a click move.
            assert(this.moveType === 'click' && this.start);
        }
    }

    onClick(sid: SquareID) {

        // Call the user callback, if any.
        this.moveFunctions.onClick?.(sid);

        if (this.moveType === 'undetermined') {
            assert(sameJSON(sid, this.start), "unexpected click square");
            this.moveType = 'click';
        } else if (this.moveType === 'click') {
            assert(this.start !== null, "start square is null at end of Move");
            this.moveFunctions.onMoveEnd?.(this.start, sid);

            this.reset();
        } else {
            assert(false, `Unexpected move type: ${this.moveType}`);
        }
    }

    private allowDrag(from: SquareID): boolean {
        // Disallow drags during a click-move unless from the starting square
        // of that move.
        if (this.moveType === 'click' && !sameJSON(from, this.start)) {
            return false;
        }

        const allowDrag = this.moveFunctions.allowDrag;
        const allowed = allowDrag ? allowDrag(from) : true;
        if(allowed) {
            this.moveType = 'drag';    
        }
        return allowed;
    }

    private onDrop(from: SquareID, to: SquareID | null) {
        assert(this.moveType === 'drag');
        assert(sameJSON(from, this.start), "inconsistent start square for drop",
            from, this.start);

        this.moveFunctions.onMoveEnd?.(from, to);

        this.reset();
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
