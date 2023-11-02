import { LegalWord, getLegalWordsForBoard } from "../../../utils/word-finder/get-legal-words/get-legal-words-for-board";
import { LetterSet } from "../../../utils/word-finder/letter-set";
import { Trie } from "../../../utils/word-finder/trie";
import { BoardAndRack } from "../client-side/board-and-rack";
import { Letter, blank } from "../config";

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
    const midCol = Math.trunc(board[0].length/2);

    const result : LegalWord[] = [];
    for(let col = 0; col <= midCol; ++col) {
        for(const word of words) {
            if(col + word.length > midCol) {
                result.push({row, col, direction:"row", word});
            }
        }
    }

    console.log(result);

    return result;
}

export function getHighScoringWords(br: BoardAndRack, trie: Trie) : LegalWord[] {
    const board = br.getBoardLetters();
    const letterSet = makeLetterSet(br.getRack());
    const words = isEmptyBoard(board) ?
        getWordsForEmptyBoard(board, letterSet, trie) :
        getLegalWordsForBoard(board, letterSet, trie);

    //console.log("board", br.getBoardLetters(), "rack", br.getRack(), "letterSet", letterSet,"nWords:", words.length);

    return words;
}