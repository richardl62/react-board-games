import { LetterSet } from "./letter-set";
import { Trie } from "./trie";
import { LetterConstraint, WordConstraint } from "./word-contraint";

describe("Trie with ConstrainedWord", () => {
    const trie = new Trie(["cat", "dog", "cow", "catdog"]);

    const testData: [string, LetterConstraint[], string[]][] = [
        ["?????", [{}, {}, {}], ["cat", "cow", "dog"]],
        ["atdog", [{ required: "c" }, {}, {}, {}, {}, {}], ["cat", "catdog"]],
        ["catdogcow", [{}, {}, { allowed: "wt" }, {}, {}, {}], ["cat", "catdog", "cow"]],
        ["catdogcow", [{}, {}, {}], ["cat", "cow", "dog"]],
    ];

    test.each(testData)("%s %s", (letters, constraints, expected) => {
        const regularCharacters = letters.replace(/\?/g, "");
        const wildcards = letters.length - regularCharacters.length;

        const letterSet = new LetterSet(regularCharacters, wildcards);
        const found = trie.findWords(new WordConstraint(letterSet, constraints));

        expect(found).toEqual(expected);
    });

});
