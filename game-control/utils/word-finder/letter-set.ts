import { WordContraint as TrieWordConstraint } from "./trie";

// Class to record the letters available to form a word.
// Intended for use with ContraintWord. Also suitable for direct
// use with Trie.
export class LetterSet implements TrieWordConstraint {
    private readonly letters: string;
    private readonly wildcards: number;
    
    constructor(letters: string, wildcards = 0) {
        this.letters = letters;
        this.wildcards = wildcards;   
    }

    // See comment in Trie
    advance(letter: string) : LetterSet | null {

        // If the letter is in the set then remove it
        const index = this.letters.indexOf(letter);
        if (index >= 0) {
            // Remove the letter from the letters
            const newLetters = this.letters.slice(0, index) + this.letters.slice(index + 1);
            // Return a copy of the letter set with the letter removed
            return new LetterSet(newLetters, this.wildcards);
        }
        // If there are wildcards then remove one
        if (this.wildcards > 0) {
            return new LetterSet(this.letters, this.wildcards - 1);
        }
        // Not found
        return null;
    }

    // No constraint on word length
    get minLengthReached() {return true;}

    // Return a copy of the letter set.
    makeCopy() : LetterSet {
        return new LetterSet(this.letters, this.wildcards);
    }
}