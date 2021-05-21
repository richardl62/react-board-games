import * as Basic from "../basic";
import { BoardProps, SquareID } from "./types";
import { assertAlert as assert } from '../../shared/assert';
import { sameJSON } from "../../shared/tools";

export class MoveStatus {
    private _start: SquareID | null = null;
    get start() {return this._start;}

    private _firstSquareClicked: boolean = false;
    get firstSquareClicked() {return this._firstSquareClicked;}

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
}

export function makeBasicOnFunctions(moveStatus: MoveStatus, props: BoardProps)
    {
    const moveStart = (sq: SquareID) => {
        moveStatus.recordMoveStart(sq);

        //console.log('moveStart', sq);
        props.onMoveStart?.(sq);
    }
    
    const moveEnd = (sq: SquareID | null) => {
        const start = moveStatus.start;
        moveStatus.reset();

        assert(start !== null, "start square is null at end of Move");

        //console.log('moveEnd', start, sq);
        props.onMoveEnd?.(start, sq);
    }

    const onFuncs : Basic.OnFunctions<SquareID> = {

        onMouseDown: (sq: SquareID) => {
            //console.log("onMouseDown", sq.toString());

            if (!moveStatus.start) {
                moveStart(sq);
            } else if(moveStatus.firstSquareClicked) {
                // Do nothing
            } else {
                // Cancel the previously started move and start a new one
                moveEnd(null);
                moveStart(sq);
            }
        },

        onClick: (id: SquareID) => {
            //console.log("onClick", id.toString());

            props.onClick?.(id);

            if(moveStatus.start) {
                if (moveStatus.firstSquareClicked) {
                    moveEnd(id);
                } else {
                    moveStatus.markAsClickMove(id);
                }
            } else {
                console.error("No start square recorded on click");
            }
        },

        allowDrag: (from: SquareID) : boolean => {
            return !moveStatus.firstSquareClicked || sameJSON(from, moveStatus.start);
        },

        onDrop: (from: SquareID, to: SquareID | null) => {
            assert(sameJSON(from, moveStatus.start), "inconsistent start square for drop",
                from, moveStatus.start);
            moveEnd(to);
        },
    }

    return onFuncs;
}

