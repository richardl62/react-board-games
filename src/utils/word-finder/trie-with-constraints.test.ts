import { LetterRequirement } from "./letter-requirement";
import { LetterSet } from "./letter-set";
import { Trie } from "./trie";
import { WordConstraint } from "./word-contraint";

describe("Trie with ConstrainedWord", () => {
    const trie = new Trie(["cat", "dog", "cow", "catdog"]);

    const testData: [
            string, // Given letters (e.g. from Scrabble rack)
            (LetterRequirement|null)[], 
            number, // minLength
            string[] // Expected result
        ][] = [
            
            ["??????",     [null, null], 1, []], // Max length implied by constraints is too short

            ["??????",     [null, null, null], 1, ["cat", "dog", "cow"]],

            ["?????",     [null, null], 1, ["cat", "cow", "dog"]],
            ["?????",     [null, null, null], 3, ["cat", "cow", "dog"]],
            ["?????",     [null, null, null], 4, []],
            ["atdog",     [{ given: "c" }, null, null, null, null, null], 6, ["cat", "catdog"]],
            ["catdog",    [null, null, null], 3, ["cat"]],
            ["catdog",    [null, null, null, {given: "x"}], 99, ["cat"]],
            ["catdogcow", [null, null, { allowed: "wt" }, null, null, null], 3, ["cat", "catdog", "cow"]],
            ["catdogcow", [null, null, null], 3, ["cat", "cow", "dog"]],
        ];

    test.each(testData)("%s %s %d", (letters, constraints, minLength, expected) => {
        const regularCharacters = letters.replace(/\?/g, "");
        const wildcards = letters.length - regularCharacters.length;

        const letterSet = new LetterSet(regularCharacters, wildcards);
        const found = trie.findWords(new WordConstraint(letterSet, constraints, minLength));

        expect(found).toEqual(expected);
    });

});
