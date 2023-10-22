import { LetterSet } from "./letter-set";
import { Trie } from "./trie";
import { WordConstraint } from "./word-contraint";

/** A "?" in the input letters denotes a wildcard*/
function makeLetterSet(letters: string) {
    const regularCharacters = letters.replace(/\?/g, "");
    const wildcards = letters.length - regularCharacters.length;

    return new LetterSet(regularCharacters, wildcards);
}

describe("Trie word length", () => {
    const trie = new Trie(["a", "bb", "ccc"]);

    const testData: [
            number, // min length
            number, // max length
            string[] // Expected result
        ][] = [
            [1, 3, ["a", "bb", "ccc"]],
            [2, 3, ["bb", "ccc"]],
            [1, 2, ["a", "bb"]],
            [2, 0, []],
        ];

    test.each(testData)("%d %d", (minLength, maxLenght, expected) => {
        const found = trie.findWords(new WordConstraint(
            new LetterSet("", 100), // more than enought wild cards 
            Array(maxLenght).fill(null), 
            minLength
        ));

        expect(found).toEqual(expected);
    });

});

describe("Trie letter set", () => {
    const trie = new Trie(["a", "bb", "cba"]);

    const testData: [
            string, // letters
            string[] // Expected result
        ][] = [
            ["bbca", ["a", "bb", "cba"]],
            ["xabc", ["a", "cba"]],
            ["", []],
            ["a?", ["a"]],
            ["b?", ["a", "bb"]],
            ["b??", ["a", "bb", "cba"]],
        ];

    test.each(testData)("%s", (letters, expected) => {
        const found = trie.findWords(new WordConstraint(
            makeLetterSet(letters),
            Array(100).fill(null), // More than enough 
            0
        ));

        expect(found).toEqual(expected);
    });

});

describe("Trie given letter", () => {
    const trie = new Trie(["aa", "bb", "cba", "ccc"]);

    const testData: [
            string, // letter set
            string, // given letters
            string[] // Expected result
        ][] = [
            ["abc", ".b.", ["bb", "cba"]],
            ["c", "..c", []],
            ["cc", "..c", ["ccc"]],
        ];

    const makeConstraint = (str: string) => {
        return str === "." ? null : {given: str};
    };

    test.each(testData)("%s", (letterSet, givenLetters, expected) => {
        const found = trie.findWords(new WordConstraint(
            makeLetterSet(letterSet),
            givenLetters.split("").map(makeConstraint),
            0
        ));

        expect(found).toEqual(expected);
    });

});

describe("Trie allowed letter", () => {
    const trie = new Trie(["aa", "bb", "cc"]);

    const testData: [
            string, // letter set
            (string|null)[], // allowed letters
            string[] // Expected result
        ][] = [
            ["b", ["b","b"], []],
            ["bb", ["b","b"], ["bb"]],
            ["??", ["ac",null], ["aa","cc"]]
        ];

    const makeConstraint = (constraint: string|null) => {
        return constraint === null ? null : {allowed: constraint};
    };

    test.each(testData)("%s %p", (letterSet, allowedLetters, expected) => {
        const found = trie.findWords(new WordConstraint(
            makeLetterSet(letterSet),
            allowedLetters.map(makeConstraint),
            0
        ));

        expect(found).toEqual(expected);
    });

});