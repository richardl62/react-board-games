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
    test("findWords('cat')", () => {
        expect(trie.findWords("cat")).toEqual(["cat"]);
    });
    test("findWords('xogd')", () => {
        expect(trie.findWords("xogd")).toEqual(["dog"]);
    });
    test("findWords('acdtog')", () => {
        expect(trie.findWords("catdog")).toEqual(["cat", "catdog", "dog"]);
    });
});

    

