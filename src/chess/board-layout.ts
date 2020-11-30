import {CorePiece} from "./core-piece";
type CorePieceArray = Array<Array<CorePiece|null>>;

class BoardLayout {

    private _corePieces : CorePieceArray;
    private _topLeftBlack : boolean;
    // Input is of form show below.  Each element is CorePiece or null.
    // [
    //     [r0c0, r0c1. ...],
    //     [r1c0, r1c1. ...], 
    //     ...
    // ]
    constructor(corePieces: CorePieceArray, topLeftBlack: boolean) {
        if(!(corePieces instanceof Array && typeof topLeftBlack === "boolean")) {
            throw new Error("Bad input to BoardLayout");
        }
        this._corePieces = corePieces;
        this._topLeftBlack = topLeftBlack;
        Object.seal(this);
    }

    copy() {
        return new BoardLayout(
            this._corePieces.map(row => [...row]), 
            this._topLeftBlack
        );
    }

    get nRows() {return this._corePieces.length;}
    get nCols() {return this._corePieces[0].length;}

    private sanityCheckRowCol(row :number, col: number) {
        if(this._corePieces[row][col] === undefined) {
            throw new Error(`Invalid row or column number: ${row} ${col}`)
        }
    }

    // Null represents an emoty square.
    setCorePiece(row :number, col: number, newPiece: CorePiece | null ) {
        this.sanityCheckRowCol(row,col);

        this._corePieces[row][col] = newPiece; 
    }

    corePiece(row: number, col: number) {
        this.sanityCheckRowCol(row, col);

        return this._corePieces[row][col];
    }

    isBlack(row: number, col: number) {
        const asTopLeft = (row + col) % 2 === 0;
        return asTopLeft ? this._topLeftBlack : !this._topLeftBlack;
    }

   findCorePiecebyId(id: number) {
        for(let row = 0; row < this.nRows; ++row) {
            for(let col = 0; col < this.nCols; ++col) {
                const cp = this._corePieces[row][col];
                if(cp && cp.id === id) {
                    return {row:row, col:col, piece:cp};
                }
            }
        }
    
        return null;
    }

    clearSquares() {
        for(let row of this._corePieces) {
            row.fill(null);
        }

        return this;
    }

    reserveRows() {
        this._topLeftBlack = this.isBlack(this.nRows-1, 0);

        let cp = this._corePieces; 
        for(let row = 0; row < this.nRows/2; ++row) {
            const otherRow = this.nRows - (row+1);
            for(let col = 0; col < this.nCols; ++col) {
                const tmp = cp[row][col];
                cp[row][col] = cp[otherRow][col];
                cp[otherRow][col] = tmp;
            }
        }

        return this;
    }
}

export {BoardLayout};