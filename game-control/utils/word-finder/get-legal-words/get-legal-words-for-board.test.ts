import { compareJSON } from "../../compare-JSON";
import { LetterSet } from "../letter-set";
import { Trie } from "../trie";
import { getLegalWordsForBoard } from "./get-legal-words-for-board";

type Results = ReturnType<typeof getLegalWordsForBoard>;

test("get possible words 1", () => {
    const trie = new Trie(["ab"]);
    const availableLetters = new LetterSet("",10);
    const board = [
        [null, null, null],
        [null, "a", null],
    ];

    //Kludge: The order of elements is choosen to make the test work.
    const expected : Results = [
        { row: 0, col: 2, direction: "column", word: "ab" },
        { row: 1, col: 1, direction: "row", word: "ab" },
    ];

    const results = getLegalWordsForBoard(board, availableLetters, trie).sort(compareJSON);

    expect(results).toEqual(expected);
});

test("get possible words 2", () => {
    const trie = new Trie(["ab","bbb", "bc"]);
    const availableLetters = new LetterSet("",10);
    const board = [
        [null, null, null],
        [null, "a", null],
        [null, null, "b"],
        [null, null, "b"],
    ];

    const expected : Results = [
        { row: 1, col: 1, direction: "row", word: "ab" },
        { row: 1, col: 2, direction: "column", word: "bbb" },
        { row: 2, col: 0, direction: "row", word: "bbb" },
        { row: 3, col: 0, direction: "row", word: "bbb" },
        { row: 3, col: 1, direction: "row", word: "ab" }
    ];

    const results = getLegalWordsForBoard(board, availableLetters, trie).sort(compareJSON);
    expect(results).toEqual(expected);
});
