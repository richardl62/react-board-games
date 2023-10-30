import { sAssert } from "../assert";

/** A letter that is supplied independantly of the set of available letters passed 
 * to a WordConstraint (e.g. a letter from a crossing word in Scrabble.)
 */
interface GivenLetter {
    /** Must be a single letter */
    given: string;

    allowed?: undefined;
}

export function givenLetter(given: string) : GivenLetter {
    sAssert(given.length === 1);
    return {given};
}

/** A constraint on a letter (e.g. to ensure that a crossing word in Scrabble is 
 * valid). */
interface AllowedLetters {
    given?: undefined;

    /** The string acts as a set of letters. */
    allowed: string;
}

export function allowedLetters(allowed: string) : AllowedLetters {
    return {allowed};
}

export type LetterRequirement = GivenLetter | AllowedLetters; 

export function isPermitted(letter: string, constraint: LetterRequirement) : boolean {

    if (constraint.given !== undefined) {
        return letter === constraint.given;
    } else {
        return constraint.allowed.indexOf(letter) >= 0;
    }
}
