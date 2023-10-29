import { transpose } from "../../../../utils/transpose";
import { LetterSet } from "../../../../utils/word-finder/letter-set";
import { Trie } from "../../../../utils/word-finder/trie";
import { getVerticalWords } from "./get-vertical-words";

interface Word {
    start: {row: number, col: number},
    word: string;

    vertical: boolean;
}

export function getPlayableWords(letters: (string| null)[][], availableLetters: LetterSet, trie: Trie) 
: Word[]
{
    const result: Word[] = [];

    const verticalWords = getVerticalWords(letters, availableLetters, trie);
    for(const {start, word} of verticalWords) {
        result.push({start, word, vertical: true});
    }

    const horizontalWords = getVerticalWords(transpose(letters), availableLetters, trie);
    for(const {start: {row, col}, word} of horizontalWords) {
        const start = {row:col, col:row};
        result.push({start, word, vertical: false});
    }

    return result;
}