import { givenLetter } from "../letter-requirement.js";
import { LetterSet } from "../letter-set.js";
import { Trie } from "../trie.js";
import { WordConstraint } from "../word-contraint.js";

/** Find the letter(s) that can come between 'before' and 'after' to form a word.
 * ('before' and 'after' can be zero length.)
 */
export function findMissingLetters(
    {before, after} : {before: string, after: string},
    trie: Trie
) : string [] // Each string records a single letter
{
    const letterRequirements = [
        ...before.split("").map(givenLetter),
        null,
        ...after.split("").map(givenLetter)
    ];

    const wordConstraint = new WordConstraint(
        new LetterSet("",1), // 1 wildcard,
        letterRequirements,
        letterRequirements.length, // min length
    );

    const words = trie.findWords(wordConstraint);

    return words.map(w => w[before.length]);
}