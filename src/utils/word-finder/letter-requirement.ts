/** A letter that is supplied independantly of the set of available letters passed 
 * to a WordConstraint (e.g. a letter from a crossing word in Scrabble.)
 */
interface GivenLetter {
    /** Must be a single letter */
    given: string;

    allowed?: undefined;
}

/** A constraint on a letter (e.g. to ensure that a crossing word in Scrabble is 
 * valid). */
interface ConstrainedLetter {
    given?: undefined;

    /** The string acts as a set of letters. */
    allowed: string;
}

export type LetterRequirement = GivenLetter | ConstrainedLetter; 

export function isPermitted(letter: string, constraint: LetterRequirement) : boolean {

    if (constraint.given !== undefined) {
        return letter === constraint.given;
    } else {
        return constraint.allowed.indexOf(letter) >= 0;
    }
}