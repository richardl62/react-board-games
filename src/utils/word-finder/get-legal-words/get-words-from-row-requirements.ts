import { LetterRequirement } from "../letter-requirement";
import { LetterSet } from "../letter-set";
import { Trie } from "../trie";
import { WordConstraint } from "../word-contraint";

type WordAndStart = {start: number; word: string};

function isGiven(r: null | undefined | LetterRequirement) : boolean {
    return Boolean(r?.given);
}
/**
 * Find words that meet the give letter requirements. Words are limited in lenght
 * by the length of the requirements array, and must include at least one letter
 * that has a requirement.
 */
export function getWordsFromRowRequirements(
    availableLetters: LetterSet,
    requirements: (LetterRequirement | null)[],
    trie: Trie,
) : WordAndStart[]
{
    const result: WordAndStart[] = [];
    for(let start = 0; start < requirements.length; ++start) {
        const wordRequirements = requirements.slice(start);
        const firstRequirementIndex = wordRequirements.findIndex(req => req !== null);

        // Words must not start/end immedidately after/before a given letter (if they did that
        // letter would be part of the word)
        if(firstRequirementIndex >= 0 && !isGiven(requirements[start-1])) {
            const wordConstraint = new WordConstraint(
                availableLetters,
                wordRequirements,
                firstRequirementIndex + 1, // min length
            );

            const words = trie.findWords(wordConstraint);
            for(const word of words) {
                if(!isGiven(wordRequirements[word.length])) {
                    result.push({word, start});
                }
            }
        }
    }

    return result;
}