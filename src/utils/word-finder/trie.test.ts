import { LetterSet } from "./letter-set";
import { Trie } from "./trie";

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
        ["cow", false],
        ["COW", false],
        ["CoW", true],
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
    const trie = new Trie(["cat", "PIG", "dog", "good", "catdog"]);


    const testData: [string, string[]][] = [
        ["cat", ["cat"]],
        ["CAT", []],
        ["pig", []],
        ["PIG", ["PIG"]],
        ["xogd", ["dog"]],
        ["oogd", ["dog", "good"]],
        ["acdtog", ["cat", "catdog", "dog"]],
        ["?at", ["cat"]],
        ["?????", ["cat", "PIG", "dog", "good"]],
    ];

    test.each(testData)("%s", (letters, expected) => {
        const regularCharacters = letters.replace(/\?/g, "");
        const wildcards = letters.length - regularCharacters.length;
        
        const found = trie.findWords(new LetterSet(regularCharacters, wildcards));
        expect(found).toEqual(expected);
    });

});

