import { transpose } from "../../transpose.js";
import { LetterSet } from "../letter-set.js";
import { Trie } from "../trie.js";
import { getCrossingWordRequirements } from "./get-crossing-word-requirements.js";
import { getWordsFromRowRequirements } from "./get-words-from-row-requirements.js";

interface ReturnedElement {
    row: number, 
    col: number,
    word: string;
}

/** As getLegalWordsForBoard, but restricted to letters in a column (rather than a row). */
export function getLegalWordsForColumns(letters: (string| null)[][], availableLetters: LetterSet, trie: Trie) 
: ReturnedElement[]
{
    const result: ReturnedElement[] = [];

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