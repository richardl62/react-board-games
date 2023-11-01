import { LetterRequirement, allowedLetters, givenLetter } from "../letter-requirement";
import { Trie } from "../trie";
import { findMissingLetters } from "./find-missing-letter";

/**
 * Return letter requirements for words that cross the given set of letters
 * These require are that:
 * 1) Any pre-existing letters are matched.
 * 2) Any new words that are form are in the trie.
 */
export function getCrossingWordRequirements(
    /** Each string should record a single letter */
    letters: (string|null)[], 
    trie: Trie
):
    (LetterRequirement | null)[] 
{
    return letters.map((_val, index) => requirement(letters, index, trie));
}

function requirement(letters: (string|null)[], index: number, trie: Trie) : LetterRequirement | null {
    const letter = letters[index];
    if (letter) {
        return givenLetter(letter);
    }

    let before = "";
    for(let i = index-1; letters[i]; --i) {
        before = letters[i] + before;
    }

    let after = "";
    for(let i = index+1; letters[i]; ++i) {
        after = after + letters[i];
    }

    if(before.length > 0 || after.length > 0) {
        const letters = findMissingLetters({before, after}, trie);
        return allowedLetters(letters.join(""));
    }

    return null;
}
