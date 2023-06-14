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

describe("Trie.findWords", () => {  
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

    

