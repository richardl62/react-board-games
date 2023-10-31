import { PossibleWord, getPossibleWords } from "../../../utils/word-finder/get-possible-words/get-possible-words";
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

export function getHighScoringWords(br: BoardAndRack, trie: Trie) : PossibleWord[] {
    const board = br.getBoardLetters();
    const letterSet = makeLetterSet(br.getRack());
    const words = getPossibleWords(board, letterSet, trie);

    //console.log("board", br.getBoardLetters(), "rack", br.getRack(), "letterSet", letterSet,"nWords:", words.length);

    return words;
}