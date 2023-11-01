// Class to represent the constraints on a word.
export interface WordContraint {
    // Called when there is a requirement to use a particular letter.
    // If this is permitted then return a copy of the WordConstraint
    // with the letter (or wildCard) removed.
    // If the letter is not permitted then return null.
    advance: (letter: string) => WordContraint | null;
    minLengthReached: boolean;
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
    addWord(word: string) {
        let node = this.root;
        for (const letter of word) {
            node = node.addChild(letter);
        }
        node.isWord = true;
    }

    // Check if a word is in the trie
    hasWord(word: string) {
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
    findWords<T extends WordContraint>(constraint: T) {
        const words : string[] = [];
        const node = this.root;
        // Find all the words that can be made from the letters
        this.findWordsRecursive(node, constraint, "", words);
        return words;
    }   

    // Find all the words that can be made from the letters
    private findWordsRecursive<T extends WordContraint>(
        node: TrieNode, 
        constraint: T, 
        word: string, 
        words: string[]
    ) {
        // If the node is a word then add it to the list of words
        if (node.isWord && constraint.minLengthReached) {
            words.push(word);
        }
        // Iterate through all the letters
        for (const [letter, child] of node.children) {
            const newLetters = constraint.advance(letter);
            if (newLetters) {
                this.findWordsRecursive(child, newLetters, word + letter, words);
            }
        }
    }
}
