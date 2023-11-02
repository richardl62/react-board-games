import { LetterSet } from "../letter-set";
import { Trie } from "../trie";
import { compareJSON } from "../../compare-JSON";
import { getLegalWordsForColumns } from "./get-legal-words-for-columns";

type Result = ReturnType<typeof getLegalWordsForColumns>;

test("get legal words for columns 1", () => {
    const trie = new Trie(["ab","bbb", "bc", "cx", "xb"]);
    const availableLetters = new LetterSet("bb",1);
    const board = [
        [null, "a", null],
        [null, null, null],
        [null, "x", null],
    ];

    const expected : Result = [
        { row:0, col: 2, word: "bbb"},
        { row:0, col: 2, word: "bc"},
        { row:1, col: 0, word: "bc"},
        { row:1, col: 2, word: "ab"},
        { row:1, col: 2, word: "xb"},
    ];

    const result = getLegalWordsForColumns(board, availableLetters, trie).sort(compareJSON);
    expect(result).toEqual(expected);
});

test("get legal words for columns 2", () => {
    const trie = new Trie(["ab","bbb", "bc"]);
    const availableLetters = new LetterSet("",10);
    const board = [
        [null, null, null],
        ["a", null, null],
        [null, null, null],
    ];

    const expected : Result = [
        { row: 0, col: 1, word: "ab" },
        { row: 0, col: 1, word: "bbb" },
        { row: 1, col: 0, word: "ab" },
        { row: 1, col: 1, word: "bc" }
    ];

    const result = getLegalWordsForColumns(board, availableLetters, trie).sort(compareJSON);

    expect(result).toEqual(expected);
});
