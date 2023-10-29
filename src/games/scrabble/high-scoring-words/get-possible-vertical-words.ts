import { transpose } from "../../../utils/transpose";
import { LetterSet } from "../../../utils/word-finder/letter-set";
import { Trie } from "../../../utils/word-finder/trie";
import { getCrossingWordRequirements } from "./get-crossing-word-requirements";
import { getWordsFromRowRequirements } from "./get-words-from-row-requirements";

export interface PossibleVerticalWord {
    row: number, 
    col: number,
    word: string;
}

/** Return the vertical words that can be played onto the given board.
 * (A vertical word is one of which the letter positions vary in the first board index)
 */
export function getVerticalWords(letters: (string| null)[][], availableLetters: LetterSet, trie: Trie) 
: PossibleVerticalWord[]
{
    console.log("In getVerticalWords");
    const result: PossibleVerticalWord[] = [];

    const rowRequirements = letters.map(row => getCrossingWordRequirements(row, trie));
    const colRequirements = transpose(rowRequirements);
    for(let col = 0; col < colRequirements.length; ++col) {
        const wordAndStarts = getWordsFromRowRequirements(
            availableLetters,
            colRequirements[col],
            trie
        );
        for(const {word, start: row} of wordAndStarts) {
            result.push({row, col, word});
        }
    }
    
    return result;
}