import { PiecePosition } from '../../interfaces';
import { SquareProperties } from './game-control';

export interface ClickManagerProps {
    getSelectedSquare: () => PiecePosition | null;
    setSelectedSquare: (arg: PiecePosition | null) => void;
    doMove: (from: PiecePosition, to: PiecePosition | null) => void;
};

export class ClickManager {
    // A piece that has been selected by a first click and is available to
    // move on a second click.
    private _props: ClickManagerProps;

    constructor(cmProps: ClickManagerProps) {
        this._props = cmProps;

        //console.log("CM Constructor:", props(this.selected));
    }

    get selected() {
        return this._props.getSelectedSquare();
    }

    private set _selected(val: PiecePosition | null) {
        //console.log("CM set: old", props(this.selected) , "new", props(val));
        this._props.setSelectedSquare(val);;
    }

    clicked(pos: PiecePosition, squareProperties: SquareProperties) {
        // console.log("CM clicked: selected", props(this.selected), "clicked", props(pos));
        if (this.selected) {
            if (PiecePosition.same(this.selected, pos)) {
                // This same square has been clicked twice. Cancel the first click.
                this._selected = null;
            } else if (squareProperties.changeable) {
                this._props.doMove(this.selected, pos);
            } else {
                this._selected = pos;
            }
        } else {
            // No square is currently selected.
            if (!squareProperties.pieceName) {
                // An empty square is clicked with nothing selected. Do nothing.
            } else {
                this._selected = pos;
            }
        }
    }

    clear() {
        this._selected = null;
    }
}