// Class to represent the constraints on a word.
interface WordContraint {
    // Called when there is a requirement to use a particular letter.
    // If this is permitted then return a ConstrainedWord for the rest of the word.
    // If the letter is not permitted then return null.
    advance: (lowerCaseletter: string) => WordContraint | null;
}

class TrieNode {
    isWord: boolean;
    children: Map<string, TrieNode>;
    constructor() {
        this.isWord = false;
        this.children = new Map();
    }
    // Add a child to the trie node
    addChild(letter: string) : TrieNode {
        // If the letter is not in the children then add it
        if (!this.children.has(letter)) {
            this.children.set(letter, new TrieNode());
        }
        // Return the child
        return this.children.get(letter)!;
    }
}

// Trie data structure for storing words. For now at least it is case insensitive.
export class Trie {
    root: TrieNode;
    constructor(words: string[] = []) {
        this.root = new TrieNode();
        for (const word of words) {
            this.addWord(word);
        }
    }

    // Add a word to the trie
    addWord(inWord: string) {
        const word = inWord.toLowerCase();
        let node = this.root;
        for (const letter of word) {
            node = node.addChild(letter);
        }
        node.isWord = true;
    }

    // Check if a word is in the trie
    hasWord(inWord: string) {
        const word = inWord.toLowerCase();

        let node = this.root;
        for (const letter of word) {
            if (!node.children.has(letter)) {
                return false;
            }
            node = node.children.get(letter)!;
        }
        return node.isWord;
    }
    
    // Find all the words that can be made from the letters
    findWords<T extends WordContraint>(letters: T) {
        const words : string[] = [];
        const node = this.root;
        // Find all the words that can be made from the letters
        this.findWordsRecursive(node, letters, "", words);
        return words;
    }   

    // Find all the words that can be made from the letters
    private findWordsRecursive<T extends WordContraint>(
        _node: TrieNode, 
        _letters: T, 
        _word: string, 
        _words: string[]
    ) {
        //npm run build and heroku deploy fails with the following error
        // TS2802: Type 'IterableIterator<[string, TrieNode]>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.
        throw new Error("Not implemented");
        // // If the node is a word then add it to the list of words
        // if (node.isWord) {
        //     words.push(word);
        // }
        // // Iterate through all the letters
        // for (const [letter, child] of node.children) {
        //     const newLetters = letters.advance(letter);
        //     if (newLetters) {
        //         this.findWordsRecursive(child, newLetters, word + letter, words);
        //     }
        // }
    }
}
