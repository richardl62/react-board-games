import { transpose } from "../../transpose";
import { LetterSet } from "../letter-set";
import { Trie } from "../trie";
import { getCrossingWordRequirements } from "./get-crossing-word-requirements";
import { getWordsFromRowRequirements } from "./get-words-from-row-requirements";

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