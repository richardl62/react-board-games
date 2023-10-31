import { sAssert } from "../../../utils/assert";
import { boardIDs } from "../client-side";
import { BoardAndRack } from "../client-side/board-and-rack";
import { blank } from "../config";
import { makeLetter } from "../config/letters";
import { PossibleWord } from "../../../utils/word-finder/get-possible-words/get-possible-words";

export function applyPossibleWord(br: BoardAndRack, possibleWord: PossibleWord) : void {
    br.recallRack();

    const { word, direction } = possibleWord;
    let { row, col } = possibleWord;
    for(const uncheckedLetter of word) {
        const letter = makeLetter(uncheckedLetter);
        sAssert(letter, `Unexpected letter "${letter}" in applyPossibleWord`);

        const boardValue = br.evalBoard(row, col);
        if (boardValue) {
            // There is already a letter on the board.
            sAssert(boardValue.letter === letter, "Unexpected letter found on board");
        } {
            let usingBlank = false;
            let rackPos = br.findInRack(letter);
            if (rackPos === null) {
                usingBlank = true;
                rackPos = br.findInRack(blank);
            }
            sAssert(rackPos !== null, `applyPossibleWord: Letter "${letter}" not found in rack`);
        
            br.moveFromRack({start:possibleWord, rackPos});
            if(usingBlank) {
                br.setBlank(
                    {row, col, boardID: boardIDs.main}, 
                    letter
                );
            }
        }
        
        if(direction === "right") {
            ++col;
        } else {
            ++row;
        }
    }
}