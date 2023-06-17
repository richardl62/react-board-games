
/** Class that records and manages the constraints on a word.
The constraints are 
- The set of letters that are available to form the word (can include
  wild cards).
- Constrains on the letter at given positions within the word. These can
  be:
  - A specific letter. This does not come from the given letter set.
  - A set of letters. The actual letter does come from the given letter set.
  - A stop mark. Words must end before this position.
**/

import { LetterSet } from "./letter-set";

export interface LetterConstraint {
    required?: string; // A specific letter
    allowed?: string; // A set of letters
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
        const constraint = this.constraints[0] || {};
        if(!isPermitted(letter, constraint)) {
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