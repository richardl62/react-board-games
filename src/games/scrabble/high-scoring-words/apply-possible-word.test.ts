import { BoardAndRack } from "../client-side/board-and-rack";
import { Letter } from "../config";
import { BoardSquareData } from "../server-side/game-state";
import { applyPossibleWord } from "./apply-possible-word";

type Board = (Letter| null)[][];
type Rack = (Letter| null)[];

function makeBoardAndRack(
    board: Board, 
    rack: Rack, 
) {
    const boardSquare = (l: Letter|null) : (BoardSquareData | null) =>
        l && {letter:l, active: true, isBlank: false};

    return new BoardAndRack(
        board.map(row => row.map(boardSquare)), 
        rack
    );
}

test("Apply possible Word 1",() => {
    // At one time this test crashed due to a problem with setting blanks.

    const br = makeBoardAndRack(
        [
            [null, null]
        ],
        ["B", "?", ],
    );

    applyPossibleWord(br,
        {row:0, col: 0, direction: "row", word: "BX"},
    );

    expect(br.getBoardLetters()).toEqual([
        ["B","X"]
    ]);

    expect(br.getRack()).toEqual([null, null]);
});

test("Apply possible Word 2",() => {

    const br = makeBoardAndRack(
        [
            [null, "X", null, null]
        ],
        [null, "?", "B", "C", "C", "A"]
    );

    applyPossibleWord(br,
        {row:0, col: 1, direction: "row", word: "AXC"},
    );

    expect(br.getBoardLetters()).toEqual([
        [null, "A", "X", "C"]
    ]);

    expect(br.getRack()).toEqual([null, "?", "B", null, "C", null]);
});

