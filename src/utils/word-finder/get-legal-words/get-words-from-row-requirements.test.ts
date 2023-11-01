import { allowedLetters, givenLetter } from "../letter-requirement";
import { LetterSet } from "../letter-set";
import { Trie } from "../trie";
import { getWordsFromRowRequirements } from "./get-words-from-row-requirements";

const g = givenLetter;
const a = allowedLetters;

test("words from row requirements 1", () => {
    const trie = new Trie(["aa","ab","bb", "abc"]);
    const requirements = [null, g("a"), null];
    const letters = new LetterSet("ab",0);
    
    const expected = [
        {start: 0, word: "aa"},
        {start: 1, word: "aa"},
        {start: 1, word: "ab"}
    ];

    const result = getWordsFromRowRequirements(letters, requirements, trie);

    expect(result).toEqual(expected);
});

test("words from row requirements 2", () => {
    // Check that words are found only when there is a contraint (so no 'free floating' words.)
    const trie = new Trie(["ab"]);
    const requirements = [null, null, null, g("a"), null, null, null, g("b")];
    const letters = new LetterSet("",1);
    
    const expected = [
        {start: 3, word: "ab"},
        {start: 6, word: "ab"},
    ];

    const result = getWordsFromRowRequirements(letters, requirements, trie);

    expect(result).toEqual(expected);
});

test("words from row requirements 3", () => {
    const trie = new Trie(["aa", "ab", "bb"]);
    const requirements = [a("ab"), a("ab")];
    const letters = new LetterSet("aab");
    
    const expected = [
        {start: 0, word: "aa"},
        {start: 0, word: "ab"},
    ];

    const result = getWordsFromRowRequirements(letters, requirements, trie);

    expect(result).toEqual(expected);
});