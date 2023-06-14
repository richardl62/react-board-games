// Class to represent a set of letters and option wildcards.
export class LetterSet {
    letters: string;
    wildcards: number;
    
    constructor(letters: string, wildcards = 0) {
        this.letters = letters;
        this.wildcards = wildcards;     
    }

    // Return a copy of the letter set with a give letter removed,
    // or undefined if the letter is not in the set.
    removeLetter(letter: string) : LetterSet | undefined {
        // If the letter is in the set then remove it
        if (this.letters.includes(letter)) {
            // Find the index of the letter in the letters
            const index = this.letters.indexOf(letter);
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
        return undefined;
    }
}