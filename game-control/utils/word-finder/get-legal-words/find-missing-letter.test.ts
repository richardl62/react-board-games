import { Trie } from "../trie";
import { findMissingLetters } from "./find-missing-letter";

describe("Find possible letters", () => {
    const trie = new Trie([
        "ab", "abc", "adc", "aef", "axcde",
    ]);

    const testData: [
            string, // before (i.e. chacters before the one we want to find)
            string, // after
            string[]  // expected result 
        ][] = [
            ["a","c", ["b","d"]],
            ["", "b", ["a"]],
            ["axcd", "", ["e"]],
            ["bxcd", "", []],
            ["", "xcde", ["a"]],
            ["", "xcfe", []],
            ["ax", "de", ["c"]],
            ["a", "b", []]
        ];

    test.each(testData)("%s %s %p", (before, after, expected) => {
        const found = findMissingLetters({before, after}, trie);

        expect(found).toEqual(expected);
    });
});