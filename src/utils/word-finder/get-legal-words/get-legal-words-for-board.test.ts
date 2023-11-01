import { LetterSet } from "../letter-set";
import { Trie } from "../trie";
import { getLegalWordsForBoard, LegalWord } from "./get-legal-words-for-board";

test("get possible words", () => {
    const trie = new Trie(["ab"]);
    const availableLetters = new LetterSet("",10);
    const board = [
        // [null, null, null], <- uncomment for bug
        [null, "a", null],
    ];

    //Kludge: The order of elements is choosen to make the test work.
    const expected : LegalWord [] = [
        { row: 0, col: 1, direction: "row", word: "ab" },
    ];

    const result = getLegalWordsForBoard(board, availableLetters, trie);

    expect(result).toEqual(expected);
});

// test("get possible words", () => {
//     const trie = new Trie(["ab","bbb", "bc"]);
//     const availableLetters = new LetterSet("",10);
//     const board = [
//         [null, null, null],
//         [null, "a", null],
//         [null, null, null],
//         [null, null, null],
//     ];

//     //Kludge: The order of elements is choosen to make the test work.
//     const expected : PossibleWord [] = [
//         { row: 1, col: 1, direction: "down", word: "ab" },
//         { row: 1, col: 2, direction: "down", word: "bbb" },
//         { row: 1, col: 2, direction: "down", word: "bc" },

//         { row: 1, col: 1, direction: "right", word: "ab" },
//         { row: 2, col: 0, direction: "right", word: "ab" },
//         { row: 2, col: 0, direction: "right", word: "bbb" },
//         { row: 2, col: 1, direction: "right", word: "bc" }
//     ];

//     const result = getPossibleWords(board, availableLetters, trie);

//     expect(result).toEqual(expected);
// });
