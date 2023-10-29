import { BoardAndRack } from "../client-side/board-and-rack";
import { blank } from "../config";
import { PossibleWord } from "./types";

export function getHighScoringWords(boardAndRack: BoardAndRack) : PossibleWord[] {
    boardAndRack.recallRack();

    const rackLetter = (ind: number) : string => {
        const letter = boardAndRack.getRack()[ind];
        if(letter === null) {
            return "";
        }
        return letter === blank ? "X" : letter;
    };

    return [
        {
            row:0, col: 0, direction: "down",
            word: [0,1,2].map(rackLetter).join(""),
        }, 
        {
            row:1, col:2, direction: "right",
            word: [2, 1, 0].map(rackLetter).join(""),
        }, 
        {
            row:2, col: 4, direction: "down",
            word: [1, 2, 3, 4].map(rackLetter).join(""),
        }
    ];
}