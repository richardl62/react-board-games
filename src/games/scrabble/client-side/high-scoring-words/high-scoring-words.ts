import { sAssert } from "../../../../utils/assert";
import { Letter } from "../../config";
import { BoardAndRack } from "../board-and-rack";
import { PossibleWord } from "./types";

export function getHighScoringWords(boardAndRack: BoardAndRack) : PossibleWord[] {
    const rackLetter = (ind: number) : Letter => {
        const letter = boardAndRack.getRack()[ind];
        sAssert(letter);
        return letter;
    };

    return [
        {
            position: {row:0, col: 0, direction: "down"},
            letters: [0,1,2].map(rackLetter),
        }, 
        {
            position: {row:1, col:2, direction: "right"},
            letters: [2, 1, 0].map(rackLetter),
        }, 
        {
            position: {row:2, col: 4, direction: "down"},
            letters: [1, 2, 3, 4].map(rackLetter),
        }
    ];
}