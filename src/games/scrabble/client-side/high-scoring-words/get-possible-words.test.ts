import { LetterSet } from "../../../../utils/word-finder/letter-set";
import { Trie } from "../../../../utils/word-finder/trie";
import { getPossibleWords } from "./get-possible-words";
import { PossibleWord } from "./types";

test("get playable words", () => {
    const trie = new Trie(["ab","bbb", "bc"]);
    const availableLetters = new LetterSet("",10);
    const board = [
        [null, "a", null],
        [null, null, null],
        [null, null, null],
    ];

    //Kludge: The order of elements is choosen to make the test work.
    const expected : PossibleWord [] = [
        { row: 0, col: 1, direction: "down", word: "ab" },
        { row: 0, col: 2, direction: "down", word: "bbb" },
        { row: 0, col: 2, direction: "down", word: "bc" },

        { row: 0, col: 1, direction: "right", word: "ab" },
        { row: 1, col: 0, direction: "right", word: "ab" },
        { row: 1, col: 0, direction: "right", word: "bbb" },
        { row: 1, col: 1, direction: "right", word: "bc" }
    ];

    const result = getPossibleWords(board, availableLetters, trie);

    expect(result).toEqual(expected);
});
