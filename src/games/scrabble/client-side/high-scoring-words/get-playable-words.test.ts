import { LetterSet } from "../../../../utils/word-finder/letter-set";
import { Trie } from "../../../../utils/word-finder/trie";
import { getPlayableWords } from "./get-playable-words";

test("get playable words", () => {
    const trie = new Trie(["ab","bbb", "bc"]);
    const availableLetters = new LetterSet("",10);
    const board = [
        [null, "a", null],
        [null, null, null],
        [null, null, null],
    ];

    const expected = [
        { start: { row: 0, col: 1 }, word: "ab", vertical: true },
        { start: { row: 0, col: 2 }, word: "bbb", vertical: true },
        { start: { row: 0, col: 2 }, word: "bc", vertical: true },

        { start: { row: 0, col: 1 }, word: "ab", vertical: false },
        { start: { row: 1, col: 0 }, word: "ab", vertical: false },
        { start: { row: 1, col: 0 }, word: "bbb", vertical: false },
        { start: { row: 1, col: 1 }, word: "bc", vertical: false }
    ];

    const result = getPlayableWords(board, availableLetters, trie);

    expect(result).toEqual(expected);
});
