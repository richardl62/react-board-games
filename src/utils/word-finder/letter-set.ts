// Class to record the letters available to form a word.
// Intended for use with Trie.
export class LetterSet {
    private letters: string;
    private wildcards: number;
    
    constructor(letters: string, wildcards = 0) {
        this.letters = letters;
        this.wildcards = wildcards;   
    }

    // Called when there is a requirement to use a particular letter.
    // If the letter is avaible then return a copy of the letter set with the letter removed.
    // If the letter is not available then return null.
    useLetter(letter: string) : LetterSet | null {

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
}