import { sAssert } from "../../../utils/assert";
import { BoardAndRack } from "../client-side/board-and-rack";
import { PossibleWord } from "./types";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function applyPossibleWord(br: BoardAndRack, possibleWord: PossibleWord) : void {
    br.recallRack();

    const { word } = possibleWord;
    for(const letter of word) {
        const rackPos = br.findInRack(letter);
        sAssert(rackPos !== null, "applyPossibleWord: Letter not found in rack ");
        br.moveFromRack({start:possibleWord, rackPos});
    }
}