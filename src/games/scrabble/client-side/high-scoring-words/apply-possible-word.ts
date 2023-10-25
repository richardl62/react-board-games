import { sAssert } from "../../../../utils/assert";
import { BoardAndRack } from "../board-and-rack";
import { PossibleWord } from "./types";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function applyPossibleWord(br: BoardAndRack, word: PossibleWord) : void {
    br.recallRack();

    const { letters, position: start } = word;
    for(const letter of letters) {
        const rackPos = br.findInRack(letter);
        sAssert(rackPos !== null, "applyPossibleWord: Letter not found in rack ");
        br.moveFromRack({start, rackPos});
    }
}