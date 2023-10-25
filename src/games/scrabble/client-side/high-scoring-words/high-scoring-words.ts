import { BoardAndRack } from "../board-and-rack";
import { PossibleWord } from "./types";

export function getHighScoringWords(_boardAndRack: BoardAndRack) : PossibleWord[] {
    const dummyWord: PossibleWord = {
        start: {row:0, column: 0},
        vertical: true,
        letters: [],
    };
    return [dummyWord, dummyWord, dummyWord];
}