import { LetterSet } from "../../../utils/word-finder/letter-set";
import { Trie } from "../../../utils/word-finder/trie";
import { PossibleVerticalWord, getVerticalWords } from "./get-possible-vertical-words";

test("get vertical words 1", () => {
    const trie = new Trie(["ab","bbb", "bc"]);
    const availableLetters = new LetterSet("",10);
    const board = [
        [null, "a", null],
        [null, null, null],
        [null, null, null],
    ];

    const expected : PossibleVerticalWord [] = [
        { row:0, col: 1, word: "ab"},
        { row:0, col: 2, word: "bbb"},
        { row:0, col: 2, word: "bc"},
    ];

    const result = getVerticalWords(board, availableLetters, trie);

    expect(result).toEqual(expected);
});

test("get vertical words 2", () => {
    const trie = new Trie(["ab","bbb", "bc"]);
    const availableLetters = new LetterSet("",10);
    const board = [
        [null, null, null],
        ["a", null, null],
        [null, null, null],
    ];

    const expected : PossibleVerticalWord [] = [
        {  row: 1, col: 0, word: "ab" },
        {  row: 0, col: 1, word: "ab" },
        { row: 0, col: 1, word: "bbb" },
        { row: 1, col: 1, word: "bc" }
    ];

    const result = getVerticalWords(board, availableLetters, trie);

    expect(result).toEqual(expected);
});
