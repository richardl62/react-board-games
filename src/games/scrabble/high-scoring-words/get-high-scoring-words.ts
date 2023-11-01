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

export function getHighScoringWords(br: BoardAndRack, trie: Trie) : LegalWord[] {
    const board = br.getBoardLetters();
    const letterSet = makeLetterSet(br.getRack());
    const words = getLegalWordsForBoard(board, letterSet, trie);

    //console.log("board", br.getBoardLetters(), "rack", br.getRack(), "letterSet", letterSet,"nWords:", words.length);

    return words;
}