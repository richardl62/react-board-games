import { Trie } from "../trie";
import { findMissingLetters } from "./find-missing-letter";

describe("Find possible letters", () => {
    const trie = new Trie([
        "ab", "abc", "adc", "aef", "axcg",
    ]);

    const testData: [
            string, // before (i.e. chacters before the one we want to find)
            string, // after
            string  // expected result (as string rather than set of characters)  
        ][] = [
            ["a","c", "bd"],
            ["", "b", "a"],
            ["axc", "", "g"],
            ["a", "b", ""]
        ];

    test.each(testData)("%s %s %s", (before, after, expected) => {
        const found = findMissingLetters({before, after}, trie);

        expect(found.join("")).toEqual(expected);
    });
});