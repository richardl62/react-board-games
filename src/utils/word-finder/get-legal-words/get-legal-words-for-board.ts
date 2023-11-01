import { transpose } from "../../transpose";
import { LetterSet } from "../letter-set";
import { Trie } from "../trie";
import { WordPosition } from "./word-position";
import { getLegalWordsForColumns } from "./get-legal-words-for-columns";

export interface LegalWord extends WordPosition {
    word: string;
}

/**
 * Find all the words that can be added to a board without creating any illegal words (i.e. the 
 * words that could be legally played in a game of Scrabble).  These words can use letters
 * that are already on the board.
 * The newly added letters are added to a single row or columns and must 
 * 1) Come from the set of letters that is passed in.
 * 2) Connect with a word that is already on the board (more precisely, at least one of the letters must
 * neighbour a letter that is already on the board).
 */

export function getLegalWordsForBoard(letters: (string| null)[][], availableLetters: LetterSet, trie: Trie) 
: LegalWord[]
{
    const result: LegalWord[] = [];

    const verticalWords = getLegalWordsForColumns(letters, availableLetters, trie);
    for(const {row, col, word} of verticalWords) {
        result.push({row, col, direction: "column", word});
    }

    const horizontalWords = getLegalWordsForColumns(transpose(letters), availableLetters, trie);
    for(const {row, col, word} of horizontalWords) {
        result.push({row:col, col:row, direction: "row", word});
    }

    return result;
}