import { LegalWord } from "../../../utils/word-finder/get-legal-words/get-legal-words-for-board";
import { WordDirection } from "../../../utils/word-finder/get-legal-words/word-position";
import { LetterSet } from "../../../utils/word-finder/letter-set";
import { Trie } from "../../../utils/word-finder/trie";
import { BoardAndRack } from "../client-side/board-and-rack";
import { wordScore } from "./word-score";
import { Letter, ScoringConfig, blank } from "../config";
import { getAllWords } from "./get-all-words";

export function makeLetterSet(letters: (Letter|null)[]) {
    let allLetters = "";
    let nBlanks = 0;
    for(const letter of letters) {
        if(letter === blank) {
            ++nBlanks;
        } else if (letter !== null) {
            allLetters += letter;
        }
    }

    return new LetterSet(allLetters, nBlanks);
}

export interface LegalWordAndScore extends LegalWord {
    score: number;
}
export function getHighScoringWords(br: BoardAndRack, trie: Trie, config: ScoringConfig) : LegalWordAndScore[] {
    br.recallRack();


    const result : LegalWordAndScore[] = [];

    const words = getAllWords(br, trie);
    for(const word of words) {
        result.push({
            ...word,
            score: wordScore(br, word, config),
        });
    }

    result.sort(compareWords);

    return result;
}

function compareWords(word1: LegalWordAndScore, word2: LegalWordAndScore) {
    
    const rowsFirst = (dir1: WordDirection, dir2: WordDirection) => {
        if(dir1 === dir2) {
            return 0;
        }
        return dir1 === "row" ? -1 : 1;
    };

    return word2.score - word1.score ||
        rowsFirst(word1.direction, word2.direction) || 
        word1.col - word2.col ||
        word1.row - word2.row ||
        word1.word.length - word2.word.length || // Shorter words first
        word1.word.localeCompare(word2.word); 
}