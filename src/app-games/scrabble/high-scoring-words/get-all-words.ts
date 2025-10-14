import { LegalWord, getLegalWordsForBoard } from "../../../utils/word-finder/get-legal-words/get-legal-words-for-board";
import { LetterSet } from "../../../utils/word-finder/letter-set";
import { Trie } from "../../../utils/word-finder/trie";
import { BoardAndRack } from "../client-side/board-and-rack";
import { Letter } from "../config";
import { makeLetterSet } from "./get-high-scoring-words";

function isEmptyBoard(board: (Letter | null)[][]) {
    const result = board.flat().findIndex((l) => l !== null) < 0;
    return result;
}

function getWordsForEmptyBoard(board: (Letter | null)[][], letterSet: LetterSet, trie: Trie) {
    const words = trie.findWords(letterSet);

    const row = Math.trunc(board.length / 2);
    const rowLength = board[0].length;
    const midCol = Math.trunc(rowLength / 2);

    const result: LegalWord[] = [];
    for (let col = 0; col <= midCol; ++col) {
        for (const word of words) {
            const wordEnd = col + word.length - 1;
            if (wordEnd >= midCol && wordEnd < rowLength) {
                result.push({ row, col, direction: "row", word });
            }
        }
    }

    return result;
}

export function getAllWords(br: BoardAndRack, trie: Trie): LegalWord[] {
    const board = br.getBoardLetters();
    const letterSet = makeLetterSet(br.getRack());
    const words = isEmptyBoard(board) ?
        getWordsForEmptyBoard(board, letterSet, trie) :
        getLegalWordsForBoard(board, letterSet, trie);

    return words;
}
