import { transpose } from "../../transpose";
import { LetterSet } from "../letter-set";
import { Trie } from "../trie";
import { getVerticalWords } from "./get-possible-vertical-words";

export type WordDirection = "right" | "down";

export interface WordPosition {
    row: number;
    col: number;
    direction: WordDirection;
}

export interface PossibleWord extends WordPosition {
    word: string;
}

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