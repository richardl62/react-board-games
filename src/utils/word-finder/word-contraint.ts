import { LetterSet } from "./letter-set";


/** A constraint of a letter a given position a word */
export interface LetterConstraint {
    /** A letter that must occur in the word if it is long enough to reach this
     * constraint. The letter is not taken from the set of available letters.
     */
    required?: string;

    /** A set of permitted letters. The matching letter is take from the set of 
     * available letters. */
    allowed?: string; 
}

/** Class that records and manages the constraints on a word.
The constraints are 
- The set of letters that are available to form the word (can include
  wild cards).
- An array of constraints on the letter at given positions within the word.
  The matched word cannot be longer than the length of this array.
**/
export class WordConstraint {
    private availableLetters: LetterSet;
    private constraints: LetterConstraint[];
    constructor(availableLetters: LetterSet, constraints: LetterConstraint[]) {
        this.availableLetters = availableLetters;
        this.constraints = constraints;
    }

    // Called when there is a requirement to use a particular letter.
    // If this is permitted then return a ConstrainedWord for the rest of the word.
    // If the letter is not permitted then return null.
    advance(letter: string) : WordConstraint | null {
        const constraint = this.constraints[0];
        if(!constraint || !isPermitted(letter, constraint)) {
            return null;
        }

        const newAvailableLetters = constraint.required ? 
            this.availableLetters.makeCopy() :
            this.availableLetters.advance(letter);

        if(!newAvailableLetters) {
            return null;
        }   

        const newConstraints = this.constraints.slice(1);
        return new WordConstraint(newAvailableLetters, newConstraints);
    }
}

function isPermitted(letter: string, constraint: LetterConstraint) {
    if(constraint.required !== undefined) {
        return letter === constraint.required;
    }

    if(constraint.allowed !== undefined) {
        return constraint.allowed.indexOf(letter) >= 0;
    }
    
    return true;
}