// KLUDGE: Gather unused code

// function isWhite(piece: string) {
//     return piece.toLowerCase()[0] === 'w';
// }

// function makeKing(piece: string) {
//     return piece.toUpperCase();
// }

// function isKing(piece: string) {
//     return piece === makeKing(piece);
// }

// const makeMove: MakeMove = ({ from, to, pieces }) => {
//     let board = new Board(pieces);

//     const rowDiff = to.row - from.row;
//     const colDiff = to.col - from.col;

//     if (Math.abs(rowDiff) === Math.abs(colDiff)) {
//         const fromPiece = nonNull(board.get(from));

//         let row = from.row;
//         let col = from.col;
//         while (row !== to.row) {
//             board.set({ row: row, col: col }, null);
//             row += row > to.row ? -1 : 1;
//             col += col > to.col ? -1 : 1;
//         }

//         const finalRow = isWhite(fromPiece) ? board.nRows - 1 : 0;
//         board.set(to, 
//             (to.row === finalRow) ? makeKing(fromPiece) : fromPiece,
//             );

//     } else {
//         // KLUDGE: The move is illegal. This should never happen with click-moves.
//         // But at time of writting, it was allowed, and sometime useful, with
//         // drags.
//         console.log("Warning non-diagonal move made");
//         board.move(from, to);
//     }
    
//     let result = new MoveResult();
//     result.endOfTurn = true;
//     return result;
// }

// function legalMovesDirected (
//     board: Board,
//     from: PiecePosition,
//     legalMoves: Array<Array<boolean>>,
//     rDelta: number,
//     cDelta: number,
// ) {
//     const current = nonNull(board.get(from));

//     let r = from.row + rDelta;
//     let c = from.col + cDelta;
//     const next = board.get2(r, c);

//     // Allow moves to empty squares, or jumps over opposing squares
//     if (next === null) {
//         legalMoves[r][c] = true;
//     } else if (next && isWhite(next) !== isWhite(current)) {
//         r += rDelta;
//         c += cDelta;
//         if (board.get2(r, c) === null) {
//             legalMoves[r][c] = true;
//         }
//     }
// }

// const legalMoves: LegalMoves = ({ from, pieces }) => {
//     const board = new Board(pieces);
    
//     const fromPiece = nonNull(board.get(from));

//     let legalMoves = pieces.map(row => row.map(() => false));

//     if(isWhite(fromPiece) || isKing(fromPiece)) {
//         legalMovesDirected(board, from, legalMoves, 1, 1);
//         legalMovesDirected(board, from, legalMoves, 1, -1);
//     }

//     if(!isWhite(fromPiece) || isKing(fromPiece)) {
//         legalMovesDirected(board, from, legalMoves, -1, 1);
//         legalMovesDirected(board, from, legalMoves, -1, -1);
//     }


//     return legalMoves;
// }

const dummy = null;
export {dummy};