import { LegalWord, getLegalWordsForBoard } from "../../../utils/word-finder/get-legal-words/get-legal-words-for-board";
import { WordDirection } from "../../../utils/word-finder/get-legal-words/word-position";
import { LetterSet } from "../../../utils/word-finder/letter-set";
import { Trie } from "../../../utils/word-finder/trie";
import { BoardAndRack } from "../client-side/board-and-rack";
import { wordScore } from "../client-side/get-words-and-score";
import { Letter, ScoringConfig, blank } from "../config";

function makeLetterSet(letters: (Letter|null)[]) {
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

function isEmptyBoard(board: (Letter|null)[][]) {
    const result = board.flat().findIndex((l) => l !== null) < 0;
    return result;
}

function getWordsForEmptyBoard(board: (Letter|null)[][], letterSet: LetterSet, trie: Trie) {
    const words = trie.findWords(letterSet);
    
    const row = Math.trunc(board.length/2);
    const rowLength = board[0].length;
    const midCol = Math.trunc(rowLength/2);

    const result: LegalWord[] = [];
    for(let col = 0; col <= midCol; ++col) {
        for(const word of words) {
            const wordEnd = col + word.length - 1;
            if(wordEnd >= midCol && wordEnd < rowLength) {
                result.push({row, col, direction:"row", word});
            }
        }
    }

    return result;
}

function getAllWords(br: BoardAndRack, trie: Trie) : LegalWord[] {
    const board = br.getBoardLetters();
    const letterSet = makeLetterSet(br.getRack());
    const words = isEmptyBoard(board) ?
        getWordsForEmptyBoard(board, letterSet, trie) :
        getLegalWordsForBoard(board, letterSet, trie);

    return words;
}

export interface LegalWordAndScore extends LegalWord {
    score: number;
}
export function getHighScoringWords(br: BoardAndRack, trie: Trie, config: ScoringConfig) : LegalWordAndScore[] {
    br.recallRack();
    
    const allWords = getAllWords(br, trie);
    const words = allWords.map(word => {
        return {
            ...word,
            score: wordScore(br, word, config),
        };
    });

    words.sort(compareWords);

    return words;
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