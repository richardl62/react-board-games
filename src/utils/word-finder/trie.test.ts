import { LetterSet } from "./letter-set";
import { Trie } from "./trie";
import { LetterConstraint, WordConstraint } from "./word-contraint";

// Unit tests for the Trie class using Jest
describe("Trie.addWord", () => {    
    test("addWord", () => {
        const trie = new Trie();
        trie.addWord("cat");
        expect(trie.root.children.get("c")!.children.get("a")!.children.get("t")!.isWord).toBe(true);
    });
});

describe("Trie.hasWord", () => {
    const words = ["cat", "dog", "CoW", "catdog"];  
    const trie = new Trie(words);

    const testData: [string, boolean][] = [
        ["cat", true],
        ["DOG", true],
        ["cOw", true],
        ["catdog", true],
        ["catd", false],
        ["catdogcow", false],
        ["", false],
        ["c", false],
    ];

    test.each(testData)("%s", (word, expected) => {
        expect(trie.hasWord(word)).toBe(expected);
    });   

});

describe("Trie with LetterSet", () => {  
    const trie = new Trie(["cat", "dog", "good", "catdog"]);


    const testData: [string, string[]][] = [
        ["cat", ["cat"]],
        ["xogd", ["dog"]],
        ["oogd", ["dog", "good"]],
        ["acdtog", ["cat", "catdog", "dog"]],
        ["?at", ["cat"]],
        ["?????", ["cat", "dog", "good"]],
    ];

    test.each(testData)("%s", (letters, expected) => {
        const regularCharacters = letters.replace(/\?/g, "");
        const wildcards = letters.length - regularCharacters.length;
        
        const found = trie.findWords(new LetterSet(regularCharacters, wildcards));
        expect(found).toEqual(expected);
    });

});

describe("Trie with ConstrainedWord", () => {  
    const trie = new Trie(["cat", "dog", "cow", "catdog"]);


    const testData: [string, LetterConstraint[], string[]][] = [
        ["?????", [], ["cat", "cow", "dog"]],
        ["atdog", [{required: "c"}], ["cat", "catdog"]],
        ["catdogcow", [{},{},{allowed: "wt"}], ["cat", "catdog", "cow"]],
        ["catdogcow", [{},{},{},{allowed:""}], ["cat", "cow", "dog"]],
    ];

    test.each(testData)("%s %s", (letters, constraints, expected) => {
        const regularCharacters = letters.replace(/\?/g, "");
        const wildcards = letters.length - regularCharacters.length;
        
        const letterSet = new LetterSet(regularCharacters, wildcards);
        const found = trie.findWords(new WordConstraint(letterSet, constraints));

        expect(found).toEqual(expected);
    });

});

    

