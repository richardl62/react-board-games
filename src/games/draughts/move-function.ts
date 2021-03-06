import { SquareID } from "../../boards";



// Find the steps in a diagonal path [from, to).
export /* TEMPORARY KLUDGE */
function findDiagonalPath(from: SquareID, to: SquareID) {
    const step = (num: number) => num > 0 ? 1 : -1;

    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    if(Math.abs(rowDiff) === Math.abs(colDiff)) {
        let positions = [];

        let {row, col} = from;
        while(row !== to.row) {
            positions.push({row:row, col: col})
            row += step(rowDiff);
            col += step(colDiff);
        }
        return positions;
    } 

    return null;
}

// export function moveFunction(from: PiecePosition, to: PiecePosition | null, moveControl: MoveControl) {
//     const fromRowCol = makeRowCol(from);
//     const toRowCol = makeRowCol(to);
//     if(fromRowCol && toRowCol) {
//         const fromPiece = moveControl.piece(from);
//         const path = findDiagonalPath(fromRowCol, toRowCol);
//         if(path && !moveControl.piece(to!)) {
//             path.forEach(pos => moveControl.setPiece(pos, null));
//             moveControl.setPiece(toRowCol, fromPiece);
//             return new MoveResult('endOfTurn');
//         }

//         return new MoveResult('noop');
//     } else {
//         return defaultMoveFunction(from, to, moveControl);
//     }
// }