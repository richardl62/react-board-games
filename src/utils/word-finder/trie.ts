// Class to represent a set of letters and option wildcards.
interface LetterSet {
    // Return a copy of the letter set with a give letter removed,
    // or undefined if the letter is not in the set.
    useLetter: (letter: string) => LetterSet | null;
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

// Trie data structure for use wuth the WordFinder class
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
    // Find all the words that can be made from the letters
    findWords<T extends LetterSet>(letters: T) {
        const words : string[] = [];
        const node = this.root;
        // Find all the words that can be made from the letters
        this.findWordsRecursive(node, letters, "", words);
        return words;
    }   

    // Find all the words that can be made from the letters
    private findWordsRecursive<T extends LetterSet>(
        node: TrieNode, 
        letters: T, 
        word: string, 
        words: string[]
    ) {
        // If the node is a word then add it to the list of words
        if (node.isWord) {
            words.push(word);
        }
        // Iterate through all the letters
        for (const [letter, child] of node.children) {
            const newLetters = letters.useLetter(letter);
            if (newLetters) {
                this.findWordsRecursive(child, newLetters, word + letter, words);
            }
        }
    }
}
