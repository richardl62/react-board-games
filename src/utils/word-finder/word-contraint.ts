import { LetterRequirement, isPermitted } from "./letter-requirement";
import { LetterSet } from "./letter-set";
import { WordContraint as TrieWordConstraint } from "./trie";

/** Class that records and manages the constraints on a word.
 * The length on the 'requirements' array gives a maximum length for the word.
**/
export class WordConstraint implements TrieWordConstraint {
    private availableLetters: LetterSet; 
    private requirements: (LetterRequirement|null)[];
    private minLength: number;

    constructor(
        availableLetters: LetterSet, 
        requirements: (LetterRequirement | null)[], 
        minLength: number
    ) {
        this.availableLetters = availableLetters;
        this.requirements = requirements;
        this.minLength = minLength;
    }

    get minLengthReached(): boolean {return this.minLength === 0;}

    // Called by Trie when there is a requirement to use a particular letter.
    // If this is permitted then return an indepentent WordConstraint for the
    // rest of the word.
    // If the letter is not permitted then return null.
    advance(letter: string) : WordConstraint | null {
        const constraint = this.requirements[0];
        
        if (constraint === undefined) {
            return null;
        }

        if(constraint && !isPermitted(letter, constraint)) {
            return null;
        }

        const newAvailableLetters = (constraint && constraint.given) ? 
            this.availableLetters.makeCopy() :
            this.availableLetters.advance(letter);

        if(!newAvailableLetters) {
            return null;
        }   

        return new WordConstraint(
            newAvailableLetters, 
            this.requirements.slice(1),
            this.minLength === 0 ? 0 : this.minLength - 1
        );
    }
}

