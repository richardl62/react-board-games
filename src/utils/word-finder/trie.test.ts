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

describe("Trie(['cat', 'dog', 'catdog']).findWord", () => {  
    const trie = new Trie(["cat", "dog", "catdog"]);
    const findWords = (letters: string) => {
        const regularCharacters = letters.replace(/\?/g, "");
        const wildcards = letters.length - regularCharacters.length;
        return trie.findWords(new LetterSet(regularCharacters, wildcards));
    };
    test("findWords('cat')", () => {
        expect(findWords("cat")).toEqual(["cat"]);
    });
    test("findWords('xogd')", () => {
        expect(findWords("xogd")).toEqual(["dog"]);
    });
    test("findWords('acdtog')", () => {
        expect(findWords("catdog")).toEqual(["cat", "catdog", "dog"]);
    });
    test("findWords('?at')", () => {
        expect(findWords("?at")).toEqual(["cat"]);
    });
    test("findWords('???')", () => {
        expect(findWords("?????")).toEqual(["cat", "dog"]);
    });
});

    

