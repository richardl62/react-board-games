import { allowedLetters, givenLetter } from "../letter-requirement";
import { LetterSet } from "../letter-set";
import { Trie } from "../trie";
import { getWordsFromRowRequirements } from "./get-words-from-row-requirements";

const g = givenLetter;
const a = allowedLetters;

type Results = ReturnType<typeof getWordsFromRowRequirements>;

test("words from row requirements 1a", () => {
    const trie = new Trie(["aa","ab","bb", "abc"]);
    const requirements = [null, g("a"), null];
    const letters = new LetterSet("ab",0);
    
    const expected : Results = [
        {start: 0, word: "aa"},
        {start: 1, word: "aa"},
        {start: 1, word: "ab"}
    ];

    const result = getWordsFromRowRequirements(letters, requirements, trie);

    expect(result).toEqual(expected);
});

test("words from row requirements 1b", () => {
    // Check the pre-existing words are not reported
    const trie = new Trie(["ab"]);
    const requirements = [g("a"), g("b")];
    const letters = new LetterSet("", 10);
    
    const expected: Results = [];

    const result = getWordsFromRowRequirements(letters, requirements, trie);

    expect(result).toEqual(expected);
});

test("words from row requirements 2", () => {
    // Check that words are found only when there is a contraint (so no 'free floating' words.)
    const trie = new Trie(["ab"]);
    const requirements = [null, null, null, g("a"), null, null, null, g("b")];
    const letters = new LetterSet("",1);
    
    const expected : Results = [
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
    
    const expected : Results = [
        {start: 0, word: "aa"},
        {start: 0, word: "ab"},
    ];

    const result = getWordsFromRowRequirements(letters, requirements, trie);

    expect(result).toEqual(expected);
});

test("words from row requirements 4", () => {
    const trie = new Trie(["aa","ab","bb"]);
    const requirements = [a("ab"), a("ab")];
    const letters = new LetterSet("aab");
    
    const expected : Results = [
        {start: 0, word: "aa"},
        {start: 0, word: "ab"},
    ];

    const result = getWordsFromRowRequirements(letters, requirements, trie);

    expect(result).toEqual(expected);
});

test("words from row requirements 5", () => {
    // Check that words can start next to allowed constraints, but not next given 
    // constraints. (This is because a given constraint comes form a letter on the
    // board wheras allowed constraints are implied by neighbouring words.)
    const trie = new Trie(["ab"]);
    const requirements = [
        a("x"), a("a"), null, null, a("b"), a("x"),
        g("x"), a("a"), null, null, a("b"), g("x")
    ];
    const letters = new LetterSet("ab");
    
    // Expect a word that starts at 0, but not at 4 or 7.  This is because words can
    // start or end next to allowed squares, but not next to given squares.
    const expected : Results = [
        {start: 1, word: "ab"},
        {start: 3, word: "ab"},
    ];

    const result = getWordsFromRowRequirements(letters, requirements, trie);
    expect(result).toEqual(expected);
});
