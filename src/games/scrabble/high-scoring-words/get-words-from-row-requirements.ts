import { LetterRequirement } from "../../../utils/word-finder/letter-requirement";
import { LetterSet } from "../../../utils/word-finder/letter-set";
import { Trie } from "../../../utils/word-finder/trie";
import { WordConstraint } from "../../../utils/word-finder/word-contraint";

type WordAndStart = {start: number; word: string};

export function getWordsFromRowRequirements(
    availableLetters: LetterSet,
    rowRequirements: (LetterRequirement | null)[],
    trie: Trie,
) : WordAndStart[]
{
    //console.log("getWordsFromRowRequirements");
    const result: WordAndStart[] = [];
    for(let start = 0; start < rowRequirements.length; ++start) {
        const wordRequirements = rowRequirements.slice(start);
        const firstRequirementIndex = wordRequirements.findIndex(req => req !== null);
        //console.log("start:",start, "wordRequirements", wordRequirements, "firstRequirement", firstRequirement);
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