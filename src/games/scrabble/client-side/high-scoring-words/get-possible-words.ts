import { transpose } from "../../../../utils/transpose";
import { LetterSet } from "../../../../utils/word-finder/letter-set";
import { Trie } from "../../../../utils/word-finder/trie";
import { getVerticalWords } from "./get-possible-vertical-words";
import { PossibleWord } from "./types";

export function getPossibleWords(letters: (string| null)[][], availableLetters: LetterSet, trie: Trie) 
: PossibleWord[]
{
    const result: PossibleWord[] = [];

    const verticalWords = getVerticalWords(letters, availableLetters, trie);
    for(const {row, col, word} of verticalWords) {
        result.push({row, col, direction: "down", word});
    }

    const horizontalWords = getVerticalWords(transpose(letters), availableLetters, trie);
    for(const {row, col, word} of horizontalWords) {
        result.push({row:col, col:row, direction: "right", word});
    }

    return result;
}