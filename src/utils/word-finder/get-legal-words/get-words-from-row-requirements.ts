import { LetterRequirement } from "../letter-requirement";
import { LetterSet } from "../letter-set";
import { Trie } from "../trie";
import { WordConstraint } from "../word-contraint";

type WordAndStart = {start: number; word: string};

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

        if(firstRequirementIndex >= 0) {
            const wordConstraint = new WordConstraint(
                availableLetters,
                wordRequirements,
                firstRequirementIndex + 1, // min length
            );

            const words = trie.findWords(wordConstraint);
            for(const word of words) {
                result.push({word, start});
            }
        }
    }

    return result;
}