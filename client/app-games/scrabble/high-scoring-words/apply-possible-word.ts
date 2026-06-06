import { blank, makeLetter } from '@game-control/games/scrabble/config/letters';
import { sAssert } from '@utils/assert';
import { LegalWord } from '@utils/word-finder/get-legal-words/get-legal-words-for-board';
import { BoardAndRack } from '../client-side/board-and-rack';
import { boardIDs } from '../client-side/game-actions';

export function applyPossibleWord(br: BoardAndRack, possibleWord: LegalWord): void {
  br.recallRack();

  const { word, direction } = possibleWord;
  let { row, col } = possibleWord;
  for (const uncheckedLetter of word) {
    const letter = makeLetter(uncheckedLetter);
    sAssert(letter, `Unexpected letter "${letter}" in applyPossibleWord`);

    const boardValue = br.evalBoard(row, col);
    if (boardValue?.letter === letter) {
      // Skip an existing letter
    } else {
      // There is already a letter on the board.
      sAssert(!boardValue, 'Unexpected letter found on board');

      let usingBlank = false;
      let rackPos = br.findInRack(letter);
      if (rackPos === null) {
        usingBlank = true;
        rackPos = br.findInRack(blank);
      }
      sAssert(rackPos !== null, `applyPossibleWord: Letter "${letter}" not found in rack`);

      br.moveFromRack({ start: possibleWord, rackPos });
      if (usingBlank) {
        br.setBlank({ row, col, boardID: boardIDs.main }, letter);
      }
    }

    if (direction === 'row') {
      ++col;
    } else {
      ++row;
    }
  }
}
