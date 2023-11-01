import { allowedLetters, givenLetter } from "../letter-requirement";
import { Trie } from "../trie";
import { getCrossingWordRequirements } from "./get-crossing-word-requirements";

const g = givenLetter;
const a = allowedLetters;


test("crossing word requirements 1", () => {
    const words = ["abc", "abd", "abef"];
    const letters = [
        "a", "b", null, null,
    ];
    const expectedResult = [
        g("a"), g("b"), a("cd"), null,
    ];

    const trie = new Trie(words);
    const result = getCrossingWordRequirements(letters, trie);

    expect(result).toEqual(expectedResult);
});

test("crossing word requirements 2", () => {
    const words = ["abc", "xbc", "ybcy"];
    const letters = [
        null, null, "b", "c",
    ];
    const expectedResult = [
        null, a("ax"), g("b"), g("c")
    ];

    const trie = new Trie(words);
    const result = getCrossingWordRequirements(letters, trie);

    expect(result).toEqual(expectedResult);
});

test("crossing word requirements 3", () => {
    const words = ["abc"];
    const letters = [
        "a", "b", null, null,
        "a", null, "c", null, null,
        null, "b", "c", null
    ];
    const expectedResult = [
        g("a"), g("b"), a("c"), a(""),
        g("a"), a("b"), g("c"), a(""), null,
        a("a"), g("b"), g("c"), a(""),
    ];

    const trie = new Trie(words);
    const result = getCrossingWordRequirements(letters, trie);

    expect(result).toEqual(expectedResult);
});

